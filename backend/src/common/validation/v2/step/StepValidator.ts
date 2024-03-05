import { ValidationResult } from '../ValidationResult';
import { Step } from './Step';
import { Validator } from '../validator/Validator';

export class StepValidator implements Validator {
  public async validate(step: Step, data: unknown): Promise<ValidationResult> {
    const validationResult = new ValidationResult(data);
    const validators = step.getValidators();
    const validationPromises: Array<Promise<ValidationResult>> = [];

    for (const validator of validators) {
      validationPromises.push(validator.validate(data));
    }

    const innerValidationResults = await Promise.all(validationPromises);

    for (const innerValidationResult of innerValidationResults) {
      if (innerValidationResult.hasErrors()) {
        validationResult.addErrors(innerValidationResult.getErrors());
      }

      if (innerValidationResult.hasWarnings()) {
        validationResult.addWarnings(innerValidationResult.getWarnings());
      }
    }

    return validationResult;
  }
}
