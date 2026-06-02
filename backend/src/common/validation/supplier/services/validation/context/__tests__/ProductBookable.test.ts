import { Product, UnitType } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { ProductBookable } from '../ProductBookable';

const buildProduct = (maxUnits: number | undefined = 6): Product =>
  ({
    options: [
      {
        default: true,
        id: 'DEFAULT',
        restrictions: { minUnits: 1, maxUnits },
        units: [{ id: 'adult', type: UnitType.ADULT }],
      },
    ],
  }) as unknown as Product;

describe('ProductBookable', () => {
  describe('reserveSlot', () => {
    it('spreads reservations across slots instead of reusing one', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [
          { id: 'a', vacancies: 10 },
          { id: 'b', vacancies: 10 },
          { id: 'c', vacancies: 10 },
        ],
      });

      const picked = [bookable.reserveSlot(1), bookable.reserveSlot(1), bookable.reserveSlot(1)];

      expect(new Set(picked).size).toBe(3);
      expect(picked).toEqual(['a', 'b', 'c']);
    });

    it('skips slots without enough remaining vacancy for the requested units', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [
          { id: 'small', vacancies: 1 },
          { id: 'big', vacancies: 5 },
        ],
      });

      // small (cursor 0) can't hold 2 units, so the allocator moves on to big.
      expect(bookable.reserveSlot(2)).toBe('big');
    });

    it('decrements remaining vacancy as it allocates', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [{ id: 'only', vacancies: 3 }],
      });

      expect(bookable.reserveSlot(2)).toBe('only');
      // 1 unit left on the only slot — still fits a 1-unit reservation.
      expect(bookable.reserveSlot(1)).toBe('only');
    });

    it('honors omitID by allocating a different slot', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [
          { id: 'a', vacancies: 10 },
          { id: 'b', vacancies: 10 },
        ],
      });

      expect(bookable.reserveSlot(1, 'a')).toBe('b');
    });

    it('returns empty string when there are no slots', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [],
      });

      expect(bookable.reserveSlot(1)).toBe('');
    });
  });

  describe('totalVacancy', () => {
    it('sums vacancies across slots', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [
          { id: 'a', vacancies: 4 },
          { id: 'b', vacancies: 6 },
        ],
      });

      expect(bookable.totalVacancy).toBe(10);
    });

    it('is Infinity when any slot is unlimited', () => {
      const bookable = new ProductBookable({
        product: buildProduct(),
        availabilityIdSoldOut: null,
        availabilitySlots: [
          { id: 'a', vacancies: 4 },
          { id: 'freesale', vacancies: Number.POSITIVE_INFINITY },
        ],
      });

      expect(bookable.totalVacancy).toBe(Number.POSITIVE_INFINITY);
    });
  });

  describe('maxUnitsPerReservation', () => {
    it('uses the option maxUnits restriction', () => {
      const bookable = new ProductBookable({
        product: buildProduct(8),
        availabilityIdSoldOut: null,
        availabilitySlots: [{ id: 'a', vacancies: 1 }],
      });

      expect(bookable.maxUnitsPerReservation).toBe(8);
    });

    it('defaults to 5 when maxUnits is not set', () => {
      const product = {
        options: [{ default: true, id: 'DEFAULT', restrictions: { minUnits: 1 }, units: [{ id: 'adult' }] }],
      } as unknown as Product;
      const bookable = new ProductBookable({
        product,
        availabilityIdSoldOut: null,
        availabilitySlots: [{ id: 'a', vacancies: 1 }],
      });

      expect(bookable.maxUnitsPerReservation).toBe(5);
    });
  });
});
