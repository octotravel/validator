import { STATUS_BAD_REQUEST, UNPROCESSABLE_ENTITY } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ModelValidator, NumberValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class UnprocessableEntityErrorValidator implements ModelValidator {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: UNPROCESSABLE_ENTITY,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      NumberValidator.validate('status', result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
