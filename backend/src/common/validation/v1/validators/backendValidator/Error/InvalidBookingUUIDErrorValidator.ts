import { Result } from './../../../services/validation/api/types';
import { NumberValidator, ModelValidator, StringValidator, ValidatorError } from './../ValidatorHelpers';
import { INVALID_BOOKING_UUID, STATUS_BAD_REQUEST } from '../../../models/Error';

export class InvalidBookingUUIDErrorValidator implements ModelValidator {
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
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
  };
}
