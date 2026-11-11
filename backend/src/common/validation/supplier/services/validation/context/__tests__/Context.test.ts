import { Product } from '@octocloud/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Context } from '../Context';

const productIn = (timeZone: string): Product => ({ timeZone }) as Product;

describe('Context', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-11T22:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getLocalDateStart', () => {
    it('returns today in the time zone of the product', () => {
      const context = new Context();

      expect(context.getLocalDateStart(productIn('Australia/Sydney'))).toBe('2026-11-12');
      expect(context.getLocalDateStart(productIn('America/Los_Angeles'))).toBe('2026-11-11');
    });

    it('falls back to the UTC day when the product time zone is invalid', () => {
      expect(new Context().getLocalDateStart(productIn('Not/AZone'))).toBe('2026-11-11');
    });

    it('keeps the day of the run start when the run crosses midnight', () => {
      const context = new Context();
      vi.setSystemTime(new Date('2026-11-12T14:00:00Z'));

      expect(context.getLocalDateStart(productIn('Australia/Sydney'))).toBe('2026-11-12');
    });
  });

  describe('getLocalDateEnd', () => {
    it('returns 30 calendar days after today in the time zone of the product', () => {
      const context = new Context();

      expect(context.getLocalDateEnd(productIn('Australia/Sydney'))).toBe('2026-12-12');
      expect(context.getLocalDateEnd(productIn('America/Los_Angeles'))).toBe('2026-12-11');
    });
  });
});
