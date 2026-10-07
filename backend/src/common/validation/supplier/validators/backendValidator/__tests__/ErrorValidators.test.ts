import { describe, expect, it } from 'vitest';
import { Result } from '../../../services/validation/api/types';
import { BadRequestErrorValidator } from '../Error/BadRequestErrorValidator';
import { InvalidAvailabilityIdErrorValidator } from '../Error/InvalidAvailabilityIdErrorValidator';
import { InvalidBookingUUIDErrorValidator } from '../Error/InvalidBookingUUIDErrorValidator';
import { InvalidOptionIdErrorValidator } from '../Error/InvalidOptionIdErrorValidator';
import { InvalidProductIdErrorValidator } from '../Error/InvalidProductIdErrorValidator';
import { InvalidUnitIdErrorValidator } from '../Error/InvalidUnitIdErrorValidator';
import { UnprocessableEntityErrorValidator } from '../Error/UnprocessableEntityErrorValidator';
import { ErrorType, ModelValidator } from '../ValidatorHelpers';

const buildResult = (status: number, data: Record<string, unknown>): Result<Record<string, unknown>> => ({
  request: null,
  response: { status, body: JSON.stringify(data), headers: {}, error: { status, body: JSON.stringify(data) } },
  data,
});

const STATUS_MESSAGE = /^response\.status has to be equal to 400/;

const cases: Array<{ name: string; validator: ModelValidator; body: Record<string, unknown> }> = [
  { name: 'BadRequest', validator: new BadRequestErrorValidator(), body: { error: 'BAD_REQUEST', errorMessage: 'x' } },
  {
    name: 'InvalidAvailabilityId',
    validator: new InvalidAvailabilityIdErrorValidator(),
    body: { error: 'INVALID_AVAILABILITY_ID', errorMessage: 'x', availabilityId: 'a' },
  },
  {
    name: 'InvalidOptionId',
    validator: new InvalidOptionIdErrorValidator(),
    body: { error: 'INVALID_OPTION_ID', errorMessage: 'x', optionId: 'o' },
  },
  {
    name: 'InvalidProductId',
    validator: new InvalidProductIdErrorValidator(),
    body: { error: 'INVALID_PRODUCT_ID', errorMessage: 'x', productId: 'p' },
  },
  {
    name: 'InvalidUnitId',
    validator: new InvalidUnitIdErrorValidator(),
    body: { error: 'INVALID_UNIT_ID', errorMessage: 'x', unitId: 'u' },
  },
  {
    name: 'UnprocessableEntity',
    validator: new UnprocessableEntityErrorValidator(),
    body: { error: 'UNPROCESSABLE_ENTITY', errorMessage: 'x' },
  },
  {
    name: 'InvalidBookingUUID (INVALID_BOOKING_UUID shape)',
    validator: new InvalidBookingUUIDErrorValidator(),
    body: { error: 'INVALID_BOOKING_UUID', errorMessage: 'x', uuid: 'u' },
  },
  {
    name: 'InvalidBookingUUID (BAD_REQUEST shape)',
    validator: new InvalidBookingUUIDErrorValidator(),
    body: { error: 'BAD_REQUEST', errorMessage: 'x' },
  },
];

describe('Error validators', () => {
  describe.each(cases)('$name', ({ validator, body }) => {
    it('should return no errors for a valid body with status 400', () => {
      expect(validator.validate(buildResult(400, body))).toEqual([]);
    });

    it.each([404, 422, 200])('should return exactly one critical status error for status %i', (status) => {
      const errors = validator.validate(buildResult(status, body));
      const statusErrors = errors.filter((e) => STATUS_MESSAGE.test(e.message));
      expect(statusErrors).toHaveLength(1);
      expect(statusErrors[0].type).toBe(ErrorType.CRITICAL);
    });
  });

  it('should still validate the error body when the status is wrong', () => {
    const errors = new InvalidProductIdErrorValidator().validate(
      buildResult(422, { error: 'WRONG', errorMessage: 'x', productId: 'p' }),
    );
    expect(errors.some((e) => STATUS_MESSAGE.test(e.message))).toBe(true);
    expect(errors.some((e) => e.message.startsWith('error has to be equal to "INVALID_PRODUCT_ID"'))).toBe(true);
  });
});
