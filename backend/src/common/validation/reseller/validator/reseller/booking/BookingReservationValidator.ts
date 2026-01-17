import { ValidationError } from 'yup';
import { createBookingSchema } from '../../../../../schemas/Booking';
import { ValidationFailureFactory } from '../../../ValidationFailureFactory';
import { ValidationResult } from '../../../ValidationResult';
import { Validator } from '../../Validator';

export class BookingReservationValidator implements Validator {
  public async validate(data: unknown): Promise<ValidationResult> {
    const validationResult = new ValidationResult(data);

    try {
      createBookingSchema.validateSync(data, { abortEarly: false, strict: true });
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
