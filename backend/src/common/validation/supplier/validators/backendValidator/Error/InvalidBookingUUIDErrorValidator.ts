import { BAD_REQUEST, INVALID_BOOKING_UUID, STATUS_BAD_REQUEST } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ResponseStatusValidator } from '../Response/ResponseStatusValidator';
import { ModelValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class InvalidBookingUUIDErrorValidator implements ModelValidator {
  private readonly responseStatusValidator = new ResponseStatusValidator({ expectedStatus: STATUS_BAD_REQUEST });

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    const validateUuid = [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: BAD_REQUEST,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
    ].flatMap((v) => (v ? [v] : []));

    const validateBookingUuid = [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: INVALID_BOOKING_UUID,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      StringValidator.validate('uuid', result?.data?.uuid),
    ].flatMap((v) => (v ? [v] : []));

    const bodyErrors = validateUuid.length === 0 || validateBookingUuid.length === 0 ? [] : validateBookingUuid;

    return [...bodyErrors, ...this.responseStatusValidator.validate(result)];
  };
}
