import { Booking } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { Result } from '../../api/types';
import { ScenarioHelper } from '../ScenarioHelper';

const buildResult = (overrides: Partial<Result<Booking>>): Result<Booking> => ({
  request: null,
  response: { status: 200, body: null, error: null, headers: {} },
  data: null,
  ...overrides,
});

describe('ScenarioHelper.hasUsableBooking', () => {
  const helper = new ScenarioHelper();

  it('is true for a successful response carrying a uuid', () => {
    const result = buildResult({ data: { uuid: 'abc-123' } as Booking });
    expect(helper.hasUsableBooking(result)).toBe(true);
  });

  it('is false when the response carried an error (e.g. sold-out reservation)', () => {
    const result = buildResult({
      data: { error: 'UNPROCESSABLE_ENTITY', uuid: null } as unknown as Booking,
      response: { status: 400, body: null, error: { status: 400, body: null }, headers: {} },
    });
    expect(helper.hasUsableBooking(result)).toBe(false);
  });

  it('is false when data is missing a uuid', () => {
    const result = buildResult({ data: {} as Booking });
    expect(helper.hasUsableBooking(result)).toBe(false);
  });

  it('is false when data is null', () => {
    const result = buildResult({ data: null });
    expect(helper.hasUsableBooking(result)).toBe(false);
  });

  it('narrows data to non-null for callers', () => {
    const result = buildResult({ data: { uuid: 'abc-123' } as Booking });
    if (helper.hasUsableBooking(result)) {
      // Type-level assertion: data is non-null inside the guard.
      expect(result.data.uuid).toBe('abc-123');
    } else {
      throw new Error('expected guard to pass');
    }
  });
});
