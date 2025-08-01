import { NOT_FOUND, STATUS_NOT_FOUND } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ModelValidator, NumberValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class NotFoundErrorValidator implements ModelValidator {
  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: NOT_FOUND,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      NumberValidator.validate('status', result?.response?.status, {
        integer: true,
        equalsTo: STATUS_NOT_FOUND,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
