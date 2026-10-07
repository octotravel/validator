import { INVALID_AVAILABILITY_ID, STATUS_BAD_REQUEST } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ResponseStatusValidator } from '../Response/ResponseStatusValidator';
import { ModelValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class InvalidAvailabilityIdErrorValidator implements ModelValidator {
  private readonly responseStatusValidator = new ResponseStatusValidator({ expectedStatus: STATUS_BAD_REQUEST });

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: INVALID_AVAILABILITY_ID,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      StringValidator.validate('availabilityId', result?.data?.availabilityId),
      ...this.responseStatusValidator.validate(result),
    ].flatMap((v) => (v ? [v] : []));
  };
}
