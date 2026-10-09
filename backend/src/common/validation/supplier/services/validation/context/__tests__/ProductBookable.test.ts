import { Availability, Product } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { ProductBookable } from '../ProductBookable';

const availability = (id: string, vacancies: number | null): Availability => ({ id, vacancies }) as Availability;

const bookable = (availabilities: Availability[]): ProductBookable =>
  new ProductBookable({
    product: {} as Product,
    availabilitiesAvailable: availabilities,
    availabilityIdSoldOut: null,
  });

describe('ProductBookable', () => {
  describe('getAvailabilityID', () => {
    it('picks the availability with most vacancies', () => {
      const product = bookable([availability('a', 1), availability('b', 5), availability('c', 2)]);

      expect(product.getAvailabilityID()).toBe('b');
    });

    it('treats null vacancies as unlimited', () => {
      const product = bookable([availability('a', 100), availability('b', null)]);

      expect(product.getAvailabilityID()).toBe('b');
    });

    it('skips the omitted availability', () => {
      const product = bookable([availability('a', 10), availability('b', 3), availability('c', 1)]);

      expect(product.getAvailabilityID({ omitID: 'a' })).toBe('b');
    });

    it('returns undefined when omitting the only availability', () => {
      const product = bookable([availability('a', 10)]);

      expect(product.getAvailabilityID({ omitID: 'a' })).toBeUndefined();
    });

    it('returns undefined when there are no availabilities', () => {
      expect(bookable([]).getAvailabilityID()).toBeUndefined();
    });

    it('accounts for reserved vacancies', () => {
      const product = bookable([availability('a', 6), availability('b', 5)]);

      product.reserveVacancies('a', 2);

      expect(product.getAvailabilityID()).toBe('b');
    });

    it('does not reduce unlimited vacancies', () => {
      const product = bookable([availability('a', null), availability('b', 50)]);

      product.reserveVacancies('a', 100);

      expect(product.getAvailabilityID()).toBe('a');
    });
  });
});
