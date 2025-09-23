import { BAD_REQUEST, INVALID_BOOKING_UUID, STATUS_BAD_REQUEST } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ModelValidator, NumberValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class InvalidBookingUUIDErrorValidator implements ModelValidator {
  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    const validateUuid = [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: BAD_REQUEST,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      NumberValidator.validate('status', result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));

    const validateBookingUuid = [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: INVALID_BOOKING_UUID,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      StringValidator.validate('uuid', result?.data?.uuid),
      NumberValidator.validate('status', result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));

    if (validateUuid.length === 0 || validateBookingUuid.length === 0) {
      return [];
    }

    return validateBookingUuid;
  };
}
