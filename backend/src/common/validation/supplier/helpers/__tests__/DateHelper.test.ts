import { describe, expect, it } from 'vitest';
import { DateHelper } from '../DateHelper';

describe('DateHelper', () => {
  describe('localDate', () => {
    it('returns the next calendar day for a time zone ahead of UTC', () => {
      expect(DateHelper.localDate(new Date('2026-11-11T22:00:00Z'), 'Australia/Sydney')).toBe('2026-11-12');
    });

    it('returns the previous calendar day for a time zone behind UTC', () => {
      expect(DateHelper.localDate(new Date('2026-11-12T03:00:00Z'), 'America/Los_Angeles')).toBe('2026-11-11');
    });

    it('returns the UTC day for UTC', () => {
      expect(DateHelper.localDate(new Date('2026-11-11T22:00:00Z'), 'UTC')).toBe('2026-11-11');
    });

    it.each([
      ['an unknown time zone', 'Not/AZone'],
      ['an empty time zone', ''],
      ['a missing time zone', undefined],
      ['a non-string time zone', 42],
    ])('falls back to the UTC day for %s', (_name, timeZone) => {
      expect(DateHelper.localDate(new Date('2026-11-11T22:00:00Z'), timeZone as string)).toBe('2026-11-11');
    });

    it('adds calendar days to the local day', () => {
      expect(DateHelper.localDate(new Date('2026-11-11T22:00:00Z'), 'Australia/Sydney', 30)).toBe('2026-12-12');
    });

    it('rolls over the year when adding days', () => {
      expect(DateHelper.localDate(new Date('2026-12-15T12:00:00Z'), 'Europe/Prague', 30)).toBe('2027-01-14');
    });

    it('adds whole calendar days across a daylight saving change', () => {
      expect(DateHelper.localDate(new Date('2026-03-01T23:30:00Z'), 'Europe/Prague', 30)).toBe('2026-04-01');
    });
  });
});
