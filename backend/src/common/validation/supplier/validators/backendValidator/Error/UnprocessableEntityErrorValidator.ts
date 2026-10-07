import { STATUS_BAD_REQUEST, UNPROCESSABLE_ENTITY } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ResponseStatusValidator } from '../Response/ResponseStatusValidator';
import { ModelValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class UnprocessableEntityErrorValidator implements ModelValidator {
  private readonly responseStatusValidator = new ResponseStatusValidator({ expectedStatus: STATUS_BAD_REQUEST });

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: UNPROCESSABLE_ENTITY,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      ...this.responseStatusValidator.validate(result),
    ].flatMap((v) => (v ? [v] : []));
  };
}
