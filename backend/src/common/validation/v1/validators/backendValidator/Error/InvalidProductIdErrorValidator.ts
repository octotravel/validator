import { INVALID_PRODUCT_ID, STATUS_BAD_REQUEST } from '../../../models/Error';
import { Result } from '../../../services/validation/api/types';
import { ModelValidator, NumberValidator, StringValidator, ValidatorError } from '../ValidatorHelpers';

export class InvalidProductIdErrorValidator implements ModelValidator {
  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any>): ValidatorError[] => {
    return [
      StringValidator.validate('error', result?.data?.error, {
        equalsTo: INVALID_PRODUCT_ID,
      }),
      StringValidator.validate('errorMessage', result?.data?.errorMessage),
      StringValidator.validate('productId', result?.data?.productId),
      NumberValidator.validate('status', result?.response?.status, {
        integer: true,
        equalsTo: STATUS_BAD_REQUEST,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
