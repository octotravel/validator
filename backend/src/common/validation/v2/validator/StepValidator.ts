import { ValidationError } from 'yup';
import { ValidationResult } from '../ValidationResult';
import { Scenario } from '../scenario/Scenario';
import { Step } from '../step/Step';
import { Validator } from './Validator';
import { ValidationFailure } from '../ValidationFailure';

export class StepValidator implements Validator {
  public constructor(private readonly step: Step) {}

  public async validate(step: Step, data: unknown): Promise<ValidationResult> {
    const validationResult = new ValidationResult(data);
    const validators = this.step.getValidators();

    for (const validator of validators) {
      validator.validate(data);
    }

    return validationResult;

    /*
      try {
        requestHeadersSchema.validateSync(parsedHeaders, { abortEarly: false, strict: true });
      } catch (e: any) {
        if (e instanceof ValidationError) {
          for (const validationError of e.errors) {
            // const validationFailure = new ValidationFailure(validationError.message, validationError.params[path]);
          }
        }

        throw e;
      } */
  }
}
