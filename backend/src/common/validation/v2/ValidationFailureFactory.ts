import { ValidationError } from 'yup';
import { ValidationFailure } from './ValidationFailure';

export class ValidationFailureFactory {
  public static createErrorFailure(error: ValidationError): ValidationFailure {
    if (error.type === 'required') {
      return new ValidationFailure(error.path ?? '', 'This field is required', error.value);
    }

    return new ValidationFailure(error.path ?? '', 'general', error.value);
  }
}
