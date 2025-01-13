import { describe, expect, it } from 'vitest';
import { AvailabilityType, OpeningHours } from '@octocloud/types';
import { CommonValidator } from '../CommonValidator';
import { ValidatorError } from '../ValidatorHelpers';

describe('CommonValidator', () => {
  describe('validateOpeningHours', () => {
    const validOpeningHours: OpeningHours[] = [
      { from: '09:00', to: '18:00' },
      { from: '10:00', to: '17:00' },
    ];

    it('should validate valid opening hours', () => {
      const errors = CommonValidator.validateOpeningHours('openingHours', validOpeningHours);
      expect(errors).toEqual([]);
    });

    it('should return errors for invalid opening hours format', () => {
      const invalidOpeningHours: OpeningHours[] = [{ from: '9:00', to: '18:00' }];
      const errors = CommonValidator.validateOpeningHours('openingHours', invalidOpeningHours);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toBeInstanceOf(ValidatorError);
    });

    it('should validate opening hours with minimum requirement for AvailabilityType.OPENING_HOURS', () => {
      const emptyOpeningHours: OpeningHours[] = [];
      const errors = CommonValidator.validateOpeningHours(
        'openingHours',
        emptyOpeningHours,
        AvailabilityType.OPENING_HOURS,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toBeInstanceOf(ValidatorError);
    });
  });

  describe('validateLocalDate', () => {
    it('should validate correct local date', () => {
      const result = CommonValidator.validateLocalDate('localDate', '2023-05-15');
      expect(result).toBeNull();
    });

    it('should return an error for incorrect local date format', () => {
      const result = CommonValidator.validateLocalDate('localDate', '2023/05/15');
      expect(result).toBeInstanceOf(ValidatorError);
    });
  });

  describe('validateLocalDateTime', () => {
    // Valid ISO 8601 date-time strings
    it('should validate correct ISO 8601 date-time format with UTC time zone', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', '2023-05-15T14:30:00Z');
      expect(result).toBeNull();
    });

    it('should validate correct ISO 8601 date-time format with timezone offset', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', '2023-05-15T14:30:00+02:00');
      expect(result).toBeNull();
    });

    it('should validate correct ISO 8601 date-time format with milliseconds and UTC timezone', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', '2023-05-15T14:30:00.123Z');
      expect(result).toBeNull();
    });

    // Invalid ISO 8601 date-time strings
    it('should return an error for ISO 8601 with missing time component', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', '2023-05-15');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    it('should return an error for ISO 8601 with incorrect format', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', '2023-05-15 14:30');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    it('should return an error for ISO 8601 with missing seconds', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', '2023-05-15T14:30Z');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    it('should return an error for non-ISO 8601 string', () => {
      const result = CommonValidator.validateLocalDateTime('localDateTime', 'May 15, 2023 14:30:00');
      expect(result).toBeInstanceOf(ValidatorError);
    });
  });

  describe('validateUTCDateTime', () => {
    it('should validate correct UTC date-time format', () => {
      const result = CommonValidator.validateUTCDateTime('utcDate', '2023-05-15T14:30:00.000Z');
      expect(result).toBeNull();
    });

    it('should return an error for incorrect UTC date-time format', () => {
      const result = CommonValidator.validateUTCDateTime('utcDate', '2023-05-15T14:30Z');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    it('should handle nullable parameter and validate null input', () => {
      const result = CommonValidator.validateUTCDateTime('utcDate', null, { nullable: true });
      expect(result).toBeNull();
    });

    it('should return error for non-null input when nullable is true but format is incorrect', () => {
      const result = CommonValidator.validateUTCDateTime('utcDate', '2023/05/15T14:30:00.000Z', { nullable: true });
      expect(result).toBeInstanceOf(ValidatorError);
    });
  });

  describe('validateUTCDate', () => {
    it('should validate correct UTC date format', () => {
      const result = CommonValidator.validateUTCDate('utcDate', '2023-05-15T14:30:00Z');
      expect(result).toBeNull();
    });

    it('should return an error for incorrect UTC date format', () => {
      const result = CommonValidator.validateUTCDate('utcDate', '2023-05-15');
      expect(result).toBeInstanceOf(ValidatorError);
    });
  });

  describe('validateUuid', () => {
    it('should validate a correct UUID v1 format', () => {
      const result = CommonValidator.validateUuid('uuid', '6db6b7fc-9d07-11ef-b864-0242ac120002');
      expect(result).toBeNull();
    });

    it('should validate a correct UUID v4 format', () => {
      const result = CommonValidator.validateUuid('uuid', '872d2045-394f-4a80-922b-7de419ef1500');
      expect(result).toBeNull();
    });

    it('should validate a correct UUID v7 format', () => {
      const result = CommonValidator.validateUuid('uuid', '019306b4-482c-7d6a-8416-f5363edb436d');
      expect(result).toBeNull();
    });

    it('should validate a nill/empty UUID format', () => {
      const result = CommonValidator.validateUuid('uuid', '00000000-0000-0000-0000-000000000000');
      expect(result).toBeNull();
    });

    it('should return an error for UUID with incorrect length', () => {
      const result = CommonValidator.validateUuid('uuid', '123e4567-e89b-12d3-a456-426614174');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    it('should return an error for UUID with invalid characters', () => {
      const result = CommonValidator.validateUuid('uuid', '550e8400-e29b-41d4-a716-44665544zzzz');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    it('should return an error for non-UUID format string', () => {
      const result = CommonValidator.validateUuid('uuid', 'not-a-uuid');
      expect(result).toBeInstanceOf(ValidatorError);
    });

    // Nullable parameter test cases
    it('should handle nullable parameter and validate null input', () => {
      const result = CommonValidator.validateUuid('uuid', null, { nullable: true });
      expect(result).toBeNull();
    });

    it('should return error for non-null input when nullable is true but format is incorrect', () => {
      const result = CommonValidator.validateUuid('uuid', 'invalid-uuid', { nullable: true });
      expect(result).toBeInstanceOf(ValidatorError);
    });
  });
});
