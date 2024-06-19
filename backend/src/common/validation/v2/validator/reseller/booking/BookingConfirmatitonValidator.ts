import { ValidationResult } from '../../../ValidationResult';
import { Validator } from '../../Validator';
import { ValidationFailureFactory } from '../../../ValidationFailureFactory';
import { ValidationError } from 'yup';
import { createBookingSchema } from '@octocloud/core';

export class BookingConfirmationValidator implements Validator {
  public async validate(data: any): Promise<ValidationResult> {
    const validationResult = new ValidationResult(data);

    try {
      createBookingSchema.validateSync(data, { abortEarly: false, strict: true });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        const validationFailures = ValidationFailureFactory.createMultipleFromYupValidationError(error);

        for (const validationFailure of validationFailures) {
          if (validationFailure.isError()) {
            validationResult.addError(validationFailure);
          } else if (validationFailure.isWarning()) {
            validationResult.addWarning(validationFailure);
          }
        }
      }
    }

    return validationResult;
  }
}
