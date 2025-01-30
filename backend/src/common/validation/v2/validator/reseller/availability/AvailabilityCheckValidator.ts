import { availabilityBodySchema } from '@octocloud/types';
import { ValidationError } from 'yup';
import { ValidationFailureFactory } from '../../../ValidationFailureFactory';
import { ValidationResult } from '../../../ValidationResult';
import { Validator } from '../../Validator';

export class AvailabilityCheckValidator implements Validator {
  public async validate(data: unknown): Promise<ValidationResult> {
    const validationResult = new ValidationResult(data);

    try {
      availabilityBodySchema.validateSync(data, { abortEarly: false, strict: true });
    } catch (error: unknown) {
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
