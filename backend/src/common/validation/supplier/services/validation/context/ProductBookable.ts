import { BookingUnitItem, Option, Product, UnitType } from '@octocloud/types';
import { PseudoRandomGenerator } from '../../../helpers/PseudoRandomGenerator';

interface GetUnitItemsData {
  quantity: number;
}

interface GetAvailabilityIDData {
  omitID: string | null;
}

/** An available availability slot and its spare capacity. `Infinity` means unlimited (FREESALE). */
export interface AvailabilitySlot {
  id: string;
  vacancies: number;
}

export class ProductBookable {
  public product: Product;
  private readonly _availabilitySlots: AvailabilitySlot[];
  private readonly _remainingVacancy: Map<string, number>;
  private _slotCursor = 0;
  private readonly _availabilityIdSoldOut: string | null;
  public constructor({
    product,
    availabilitySlots,
    availabilityIdSoldOut,
  }: {
    product: Product;
    availabilitySlots: AvailabilitySlot[] | null;
    availabilityIdSoldOut: string | null;
  }) {
    this.product = product;
    this._availabilitySlots = availabilitySlots ?? [];
    this._remainingVacancy = new Map(this._availabilitySlots.map((slot) => [slot.id, slot.vacancies]));
    this._availabilityIdSoldOut = availabilityIdSoldOut;
  }

  public get availabilitySlots(): AvailabilitySlot[] {
    return this._availabilitySlots;
  }

  public get availabilityIdAvailable(): string[] {
    return this._availabilitySlots.map((slot) => slot.id);
  }

  public get availabilityIdSoldOut(): string | null {
    return this._availabilityIdSoldOut;
  }

  public get isSoldOut(): boolean {
    return this._availabilityIdSoldOut !== null;
  }

  public get isAvailable(): boolean {
    return this._availabilitySlots.length > 0;
  }

  public get hasMultipleAvailabilities(): boolean {
    return this._availabilitySlots.length === 2;
  }

  /** Total spare capacity across all available slots (`Infinity` if any slot is unlimited). */
  public get totalVacancy(): number {
    return this._availabilitySlots.reduce((sum, slot) => sum + slot.vacancies, 0);
  }

  /** Upper bound on units a single valid reservation holds — see {@link getValidUnitItems}. */
  public get maxUnitsPerReservation(): number {
    return this.getOption().restrictions.maxUnits ?? 5;
  }

  public get randomAvailabilityID(): string {
    return this.reserveSlot();
  }

  /**
   * Allocate an availability slot that can still hold `units`, decrement its tracked remaining
   * vacancy, and rotate across slots so reservations spread out instead of exhausting one slot.
   * The controller's pre-flight capacity check is expected to guarantee enough capacity; if a run
   * still over-subscribes, this falls back to the slot with the most remaining vacancy.
   */
  public reserveSlot = (units = 1, omitID: string | null = null): string => {
    const candidates = this._availabilitySlots.filter((slot) => slot.id !== omitID);
    if (candidates.length === 0) {
      return this._availabilitySlots[0]?.id ?? '';
    }

    for (let offset = 0; offset < candidates.length; offset++) {
      const slot = candidates[(this._slotCursor + offset) % candidates.length];
      const remaining = this._remainingVacancy.get(slot.id) ?? 0;
      if (remaining >= units) {
        this._remainingVacancy.set(slot.id, remaining - units);
        this._slotCursor = (this._slotCursor + offset + 1) % candidates.length;
        return slot.id;
      }
    }

    const best = candidates.reduce((a, b) =>
      (this._remainingVacancy.get(b.id) ?? 0) > (this._remainingVacancy.get(a.id) ?? 0) ? b : a,
    );
    this._remainingVacancy.set(best.id, (this._remainingVacancy.get(best.id) ?? 0) - units);
    return best.id;
  };

  public getAvialabilityID = (data: GetAvailabilityIDData): string => {
    return this.reserveSlot(1, data.omitID);
  };

  public getValidUnitItems = (data?: GetUnitItemsData): BookingUnitItem[] => {
    const option = this.getOption();
    const unit = option.units.find((unit) => unit.type === UnitType.ADULT) ?? option.units[0];
    const unitId = unit.id;

    const quantity =
      data?.quantity ??
      new PseudoRandomGenerator(option.id).nextInt(
        option.restrictions.minUnits || 1,
        option.restrictions.maxUnits ?? 5,
      );
    return Array(quantity).fill({ unitId });
  };

  public getInvalidUnitItems = (data?: GetUnitItemsData): BookingUnitItem[] => {
    const quantity = data?.quantity ?? 1;
    const unitItems = Array.from({ length: quantity }, () => {
      return {
        unitId: 'invalidUnitId',
      };
    });
    return unitItems;
  };

  public getOption = (): Option => {
    const option = this.product.options.find((option: Option) => option.default) ?? this.product.options[0];

    return option;
  };
}
