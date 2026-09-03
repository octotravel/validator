# Spec: Pre-flight reservation demand & capacity-aware slot allocation

Status: proposed
Scope: supplier validation only (`backend/src/common/validation/supplier/services/validation`)

## 1. Problem

The supplier-validation booking lifecycle fails against suppliers that expose **finite
availability capacity** (observed on SIA staging, capacity 60/slot). Symptoms: late booking
scenarios send `PATCH/GET/POST /bookings/null`, `List Bookings` returns `200 []`, all reported as
cryptic `INVALID_BOOKING_UUID` / "bookings field must have at least 1 items".

### Root cause

1. **Every reservation in a run targets one single availability slot.**
   `ProductBookable.pickRandomAvailabilityID` (`context/ProductBookable.ts:57`) creates a fresh
   `PseudoRandomGenerator` **seeded with `array.length`** (a constant) on every call. The LCG is
   deterministic, so the first `.next()` is always identical → the same index → the same slot for
   every reservation. It is not random.

2. **The run reserves ~15 times against that one slot**, each holding up to `maxUnits` (≤5) units.
   Unconfirmed reservations still hold inventory. Peak demand (~15 × up to 5 = up to ~75 units) >
   slot capacity (60) → supplier returns `400 UNPROCESSABLE_ENTITY "This availability is sold out"`.
   Verified directly: 30 reservations × 2 units exhaust a 60-capacity slot exactly, the 31st fails.

3. **Failed reservations are not detected.** `Client.parseResponse` (`api/Client.ts`) sets
   `data = JSON.parse(text)` regardless of HTTP status, so on a 400 `data` is the *error body*
   (truthy). The scenario guard `if (result.data === null)` never trips, and
   `result.data.uuid` (= `null`) flows into the next request URL as `/bookings/null`.

Staging itself is correct: reserve → confirm → list-by-reference all work on a fresh slot
(verified, list returns the booking). The failures are entirely validator-side.

## 2. Goals

1. **Calculate the run's reservation demand up front** (number of valid reservations × units each).
2. **Check availability against that demand** before the booking flows run; fail fast with a clear,
   actionable error if supply is insufficient.
3. **Allocate a sufficiently-capacious / distinct slot per reservation** so no single slot is
   over-subscribed. Removes the deterministic single-slot bug.
4. **Surface genuine reservation/confirmation failures legibly** ("Reservation Creation Failed" +
   supplier error) instead of leaking `null` downstream.

Non-goals: changing reseller validation; changing the OCTO scenarios' assertions; supporting
suppliers with zero spare capacity (those will fail fast with a clear message, which is correct).

## 3. Reservation demand (current, valid reservations against `availableProducts[0]`)

| Flow | Scenarios that reserve real inventory | Count |
|------|----------------------------------------|-------|
| Booking Reservation | `reserveAvailableProduct` (invalid/sold-out variants don't consume) | 1 |
| Booking Extend | `BookingReservationExtend` | 1 |
| Booking Confirmation | `BookingConfirmation`, `BookingConfirmationUnitItemsUpdate`, `BookingConfirmationInvalidUnitId` | 3 |
| Booking Update | `Date`, `UnitItems`, `Contact`, `Product`* | 4 |
| Booking Cancellation | `Reservation`, `Booking` | 2 |
| Booking Get | `Reservation`, `Booking` | 2 |
| Booking List | `ResellerReference`, `SupplierReference` | 2 |
| **Total** | | **~15** |

\* `BookingUpdateProduct` also re-books onto `availableProducts[1]` via the update call.

Units per reservation come from `ProductBookable.getValidUnitItems` (deterministic quantity in
`[minUnits||1, maxUnits??5]`); `BookingUpdateUnitItems` uses quantity 2 then updates to 3.

Because the count is spread across many scenario files, the demand must be **declared centrally**
rather than re-counted by hand (see §4.1).

## 4. Design

### 4.1 Declare & aggregate reservation demand

Introduce a single source of truth for demand instead of inferring it.

- Add `ReservationDemand` = `{ reservations: number; maxUnitsPerReservation: number }`.
- **Decision: (A) Per-flow declaration.** Each booking `Flow` exposes
  `getReservationDemand(context): ReservationDemand` (default `{ reservations: 0, … }` on
  `BaseFlow` for non-booking flows). The controller sums demand across the booking flows before
  running them. Self-maintaining: adding/removing a reserving scenario updates its flow's demand in
  the same file, so the aggregate can't silently drift.

`maxUnitsPerReservation` is computed from the selected product's default option:
`min(maxUnits ?? 5, …)` — use the actual `getValidUnitItems` quantity where fixed.

### 4.2 Retain capacity in the bookable pool

`AvailabilityStatusScenarioHelper.findAvailableProducts`
(`helpers/AvailabilityStatusScenarioHelper.ts:77`) currently maps availabilities to **IDs only**.
Change it to retain `{ id, vacancies }` (or the full `Availability`) so capacity is known.

- Extend `ProductBookable` to store `availabilitySlots: { id: string; vacancies: number }[]`
  (keep `availabilityIdAvailable` as a derived getter for back-compat).
- Note: `findAvailableProducts` also has a latent bug — the filter
  `status === AVAILABLE || FREESALE || LIMITED` is always-truthy (it tests the enum value, not
  `status ===`). Fix to `[AVAILABLE, FREESALE, LIMITED].includes(status)` while here.

### 4.3 Capacity-aware slot allocator (replaces the broken picker)

Replace `pickRandomAvailabilityID` with a **stateful allocator** on `ProductBookable`:

- `reserveSlot(units: number): string | null` — returns the id of a slot with
  `remainingVacancy >= units`, decrements its tracked remaining vacancy, and rotates so load
  spreads across slots; returns `null` when no slot can satisfy the request.
- Tracks consumption in-memory for the run (reservations hold inventory whether or not confirmed).
- `getAvialabilityID({ omitID })` (used by `BookingUpdateDate`) keeps its "pick a different slot"
  semantics but routes through the same allocator.

`Booker.createReservation` (`Booker.ts`) calls `reserveSlot(unitItems.length)` instead of
`randomAvailabilityID`. For invalid/sold-out variants the existing override params are unchanged.

### 4.4 Pre-flight availability check

Add a check that runs **after the Availability flow populates `availableProducts` and before
`BookingReservationFlow`** (new step in `Controller.validate`, or a dedicated lightweight flow):

- Compute `requiredUnits = demand.reservations × demand.maxUnitsPerReservation`.
- Compute `availableUnits = sum(vacancies)` across the chosen product's usable slots.
- **Decision: hard-terminate.** If `availableUnits < requiredUnits` **or** fewer usable slots than
  needed → emit one CRITICAL scenario result and set `context.terminateValidation = true`, with a
  clear message, e.g.
  `Insufficient availability to run the booking lifecycle: need N units across the validation
  window, supplier exposes M. Widen availability or reduce date range.`
- This converts today's cryptic mid-run failures into one explicit, early, actionable result.

### 4.5 Detect reservation/confirmation failures (safeguard)

Add a shared guard used by the **positive** booking scenarios (not the negative ones, which expect
4xx and assert on `response.error`):

- A helper `isReservationOk(result)` → `result.response?.error === null && result.data?.uuid`.
- Positive scenarios replace `if (result.data === null)` with this guard and report
  `Reservation Creation Failed` + the supplier error body when it fails.
- Do **not** change `Client.parseResponse` globally (error-response validators rely on `data`
  holding the parsed error body).

## 5. Affected files

- `context/ProductBookable.ts` — slot storage, allocator, remove deterministic picker.
- `context/ProductContext.ts` / `context/Context.ts` — expose demand/pre-flight hooks if needed.
- `helpers/AvailabilityStatusScenarioHelper.ts` — retain vacancies; fix always-truthy filter.
- `Booker.ts` — use `reserveSlot`.
- `Controller.ts` — insert pre-flight availability check between Availability and Reservation flows.
- New: `ReservationDemandCalculator.ts` (+ helper for the positive-scenario guard).
- Positive booking scenarios under `Scenarios/Booking/**` — adopt `isReservationOk` guard.

## 6. Testing

- Unit: `ReservationDemandCalculator` returns expected count; a guard test asserts the declared
  count equals the number of reservation-making booking scenarios (drift detection).
- Unit: allocator spreads across slots, respects per-slot vacancy, returns `null` when exhausted.
- Unit: pre-flight check terminates with the clear error when `availableUnits < requiredUnits`.
- Unit: `findAvailableProducts` filter now correctly excludes non-available statuses.
- Integration/regression: re-run supplier validation against SIA staging
  (`https://api.stg.siaticketing.com/api/v2/octo`) → Update / Cancellation / Get / List flows green.

## 7. Rollout / risk

- Behavior change is confined to supplier validation slot selection + an added early check.
- Suppliers with ample/FREESALE inventory: unaffected (allocator just spreads; check passes).
- Suppliers with truly insufficient capacity: now fail fast with a clear message instead of
  misleading per-scenario errors — an improvement, but a visible change in output. Call out in PR.

## 8. Decisions (resolved)

1. **Demand declaration: per-flow (A).** Each booking flow declares its own demand; controller sums.
2. **Pre-flight failure: hard-terminate** the run with one clear CRITICAL result (supply < demand).
3. **§4.5 guard tightening ships in this PR** (low risk, makes reservation failures legible).
