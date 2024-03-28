import { ValidationError } from 'yup';
import { ValidationFailure } from './ValidationFailure';
import { ValidationFailureType } from './ValidationFailureType';

export class ValidationFailureFactory {
  public static createMultipleFromYupValidationError(validationError: ValidationError): ValidationFailure[] {
    const validationFailures: ValidationFailure[] = [];

    if (validationError.inner.length === 0) {
      validationFailures.push(this.createOneFromYupValidationError(validationError));
    }

    for (const innerValidationError of validationError.inner) {
      validationFailures.push(this.createOneFromYupValidationError(innerValidationError));
    }

    return validationFailures;
  }

  public static createOneFromYupValidationError(validationError: ValidationError): ValidationFailure {
    let type: ValidationFailureType;

    if (validationError.type === 'required' || validationError.type === 'typeError') {
      type = ValidationFailureType.ERROR;
    } else {
      type = ValidationFailureType.WARNING;
    }

    return new ValidationFailure(type, validationError.path ?? '', validationError.message, validationError.value);
  }
}
