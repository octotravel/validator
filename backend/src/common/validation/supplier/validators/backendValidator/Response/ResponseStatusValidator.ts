import { Result } from '../../../services/validation/api/types';
import { ErrorType, ModelValidator, NumberValidator, ValidatorError } from '../ValidatorHelpers';

export class ResponseStatusValidator implements ModelValidator {
  private readonly expectedStatus: number;

  public constructor({ expectedStatus }: { expectedStatus: number }) {
    this.expectedStatus = expectedStatus;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public validate = (result: Result<any> | null): ValidatorError[] => {
    return [
      NumberValidator.validate('response.status', result?.response?.status, {
        integer: true,
        equalsTo: this.expectedStatus,
        errorType: ErrorType.CRITICAL,
      }),
    ].flatMap((v) => (v ? [v] : []));
  };
}
