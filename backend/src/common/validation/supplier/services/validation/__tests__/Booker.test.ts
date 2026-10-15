import { Availability, Booking, Option, Product, UnitType } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { Result } from '../api/types';
import { Booker } from '../Booker';
import { Context } from '../context/Context';
import { ProductBookable } from '../context/ProductBookable';

const productBookable = (
  availabilities: Array<Pick<Availability, 'id' | 'vacancies'>> = [{ id: 'availability', vacancies: 10 }],
): ProductBookable =>
  new ProductBookable({
    product: {
      id: 'product',
      options: [
        {
          id: 'option',
          default: true,
          units: [{ id: 'adult', type: UnitType.ADULT, restrictions: { minQuantity: null, maxQuantity: null } }],
          restrictions: { minUnits: 0, maxUnits: null },
        } as unknown as Option,
      ],
    } as Product,
    availabilitiesAvailable: availabilities as Availability[],
    availabilityIdSoldOut: null,
  });

const contextReturning = (result: Result<unknown>): Context =>
  ({
    invalidAvailabilityId: 'invalidAvailabilityId',
    getApiClient: () => ({ bookingReservation: async () => result }),
  }) as unknown as Context;

describe('Booker', () => {
  describe('createReservation', () => {
    it('returns the error result when the supplier echoes availabilityId in an error body', async () => {
      const result = {
        request: null,
        response: { status: 400, body: null, headers: {}, error: { status: 400, body: null } },
        data: {
          error: 'INVALID_AVAILABILITY_ID',
          errorMessage: 'Invalid availability Id.',
          availabilityId: 'invalidAvailabilityId',
        },
      } as unknown as Result<Booking>;

      const reservation = await new Booker().createReservation(productBookable(), contextReturning(result), {
        invalidAvailabilityId: true,
      });

      expect(reservation).toBe(result);
    });

    it('does not reserve vacancies for a failed reservation', async () => {
      const bookable = productBookable([
        { id: 'a', vacancies: 3 },
        { id: 'b', vacancies: 2 },
      ]);
      const result = {
        request: null,
        response: { status: 400, body: null, headers: {}, error: { status: 400, body: null } },
        data: { error: 'UNPROCESSABLE_ENTITY', availabilityId: 'a', unitItems: [{}, {}] },
      } as unknown as Result<Booking>;

      await new Booker().createReservation(bookable, contextReturning(result));

      expect(bookable.getAvailabilityID()).toBe('a');
    });

    it('reserves vacancies for a successful reservation', async () => {
      const bookable = productBookable([
        { id: 'a', vacancies: 3 },
        { id: 'b', vacancies: 2 },
      ]);
      const result = {
        request: null,
        response: { status: 200, body: null, headers: {}, error: null },
        data: { availabilityId: 'a', unitItems: [{}, {}] },
      } as unknown as Result<Booking>;

      await new Booker().createReservation(bookable, contextReturning(result));

      expect(bookable.getAvailabilityID()).toBe('b');
    });
  });
});
