import { Booking, BookingReservationBody } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { BookingEndpointValidator } from '../Booking/BookingEndpointValidator';
import { ErrorType } from '../ValidatorHelpers';

const schema = {
  productId: 'p',
  optionId: 'DEFAULT',
  availabilityId: 'a',
  unitItems: [{ unitId: 'adult' }],
} as BookingReservationBody;

describe('BookingEndpointValidator', () => {
  describe('validateReservation', () => {
    it('should report a critical unitItems error instead of throwing when unitItems is missing', () => {
      const reservation = { status: 'ON_HOLD' } as Booking;
      const errors = new BookingEndpointValidator().validateReservation({ schema, reservation });
      expect(errors.some((e) => e.type === ErrorType.CRITICAL && e.message.startsWith('booking.unitItems'))).toBe(true);
    });
  });
});
