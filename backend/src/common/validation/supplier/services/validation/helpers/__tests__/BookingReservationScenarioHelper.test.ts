import { Booking } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { Result } from '../../api/types';
import { Context } from '../../context/Context';
import { ValidationResult } from '../../Scenarios/Scenario';
import { BookingReservationScenarioHelper } from '../BookingReservationScenarioHelper';

const STATUS_MESSAGE = /^response\.status has to be equal to 200/;

const buildResult = (status: number, body: string): Result<Booking> => {
  let data: Booking | null = null;
  try {
    data = JSON.parse(body);
  } catch {
    data = null;
  }
  return {
    request: {
      url: 'https://supplier.test/bookings',
      method: 'POST',
      body: { productId: 'p', optionId: 'DEFAULT', availabilityId: 'a', unitItems: [{ unitId: 'adult' }] },
      headers: {},
    },
    response: {
      status,
      body,
      headers: {},
      error: status >= 200 && status < 300 ? null : { status, body },
    },
    data,
  };
};

const validate = (result: Result<Booking>) =>
  new BookingReservationScenarioHelper().validateBookingReservation(
    { name: 'Booking Reservation', description: 'test', result },
    new Context(),
  );

describe('BookingReservationScenarioHelper', () => {
  it('should report a critical status error and still validate the body for 201', () => {
    const scenario = validate(buildResult(201, JSON.stringify({ status: 'ON_HOLD', unitItems: [] })));
    const statusErrors = scenario.errors.filter((e) => STATUS_MESSAGE.test(e.message));
    expect(statusErrors).toHaveLength(1);
    expect(statusErrors[0].message).toBe('response.status has to be equal to 200, but the provided value was: 201');
    expect(scenario.errors.length).toBeGreaterThan(1);
    expect(scenario.success).toBe(false);
    expect(scenario.validationResult).toBe(ValidationResult.FAILED);
  });

  it('should report only the status error for a 500 with a JSON error body', () => {
    const scenario = validate(
      buildResult(500, JSON.stringify({ error: 'INTERNAL_SERVER_ERROR', errorMessage: 'boom' })),
    );
    expect(scenario.errors).toHaveLength(1);
    expect(scenario.errors[0].message).toBe('response.status has to be equal to 200, but the provided value was: 500');
    expect(scenario.success).toBe(false);
    expect(scenario.validationResult).toBe(ValidationResult.FAILED);
  });

  it('should report the status error and a parse error for a 502 with a non-JSON body', () => {
    const scenario = validate(buildResult(502, '<html>Bad Gateway</html>'));
    expect(scenario.errors.some((e) => STATUS_MESSAGE.test(e.message))).toBe(true);
    expect(scenario.errors.some((e) => e.message.startsWith('Endpoint response cannot be parsed'))).toBe(true);
    expect(scenario.errors.some((e) => e.message === 'Endpoint cannot be validated')).toBe(false);
    expect(scenario.success).toBe(false);
  });

  it('should not report a status error for 200', () => {
    const scenario = validate(buildResult(200, JSON.stringify({ status: 'ON_HOLD', unitItems: [] })));
    expect(scenario.errors.some((e) => STATUS_MESSAGE.test(e.message))).toBe(false);
  });

  it('should report a critical error without throwing when the response is missing', () => {
    const scenario = validate({ request: null, response: null, data: null });
    expect(scenario.success).toBe(false);
    expect(scenario.validationResult).toBe(ValidationResult.FAILED);
  });
});
