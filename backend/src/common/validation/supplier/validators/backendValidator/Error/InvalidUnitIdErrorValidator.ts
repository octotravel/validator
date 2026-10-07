import { INVALID_UNIT_ID, STATUS_BAD_REQUEST } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ResponseStatusValidator } from '../Response/ResponseStatusValidator';
import { ModelValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class InvalidUnitIdErrorValidator implements ModelValidator {
  private readonly responseStatusValidator = new ResponseStatusValidator({ expectedStatus: STATUS_BAD_REQUEST });

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: INVALID_UNIT_ID,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      StringValidator.validate('unitId', result?.data?.unitId),
      ...this.responseStatusValidator.validate(result),
    ].flatMap((v) => (v ? [v] : []));
  };
}
