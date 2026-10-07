import { describe, expect, it } from 'vitest';
import { STATUS_BAD_REQUEST, STATUS_SUCCESS } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ResponseStatusValidator } from '../Response/ResponseStatusValidator';
import { ErrorType } from '../ValidatorHelpers';

const buildResult = (status: number): Result<unknown> => ({
  request: null,
  response: { status, body: null, headers: {}, error: null },
  data: null,
});

describe('ResponseStatusValidator', () => {
  describe('expected 200', () => {
    const validator = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS });

    it('should return no errors for 200', () => {
      expect(validator.validate(buildResult(200))).toEqual([]);
    });

    it.each([201, 204, 400, 500])('should return a critical error for %i', (status) => {
      const errors = validator.validate(buildResult(status));
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.CRITICAL);
      expect(errors[0].message).toBe(`response.status has to be equal to 200, but the provided value was: ${status}`);
    });
  });

  describe('expected 400', () => {
    const validator = new ResponseStatusValidator({ expectedStatus: STATUS_BAD_REQUEST });

    it('should return no errors for 400', () => {
      expect(validator.validate(buildResult(400))).toEqual([]);
    });

    it.each([200, 404, 422])('should return a critical error for %i', (status) => {
      const errors = validator.validate(buildResult(status));
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.CRITICAL);
    });
  });

  it('should return a critical error when the response is missing', () => {
    const validator = new ResponseStatusValidator({ expectedStatus: STATUS_SUCCESS });
    const errors = validator.validate({ request: null, response: null, data: null });
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ErrorType.CRITICAL);
  });
});
