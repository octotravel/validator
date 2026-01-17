import { object, SchemaOf, string, ValidationError } from 'yup';
import { ValidationFailureFactory } from '../../ValidationFailureFactory';
import { ValidationResult } from '../../ValidationResult';
import { octoCapabilitiesValidator } from '../../yup/RequiredHeaders';
import { Validator } from '../Validator';

export interface RequestHeadersSchema {
  Authorization: string;
  'Content-Type': string;
  'Octo-Capabilities': string;
}

export const requestHeadersSchema: SchemaOf<RequestHeadersSchema> = object().shape({
  Authorization: string().required(),
  'Content-Type': string().required(),
  'Octo-Capabilities': octoCapabilitiesValidator.default(''),
});

export class RequestHeadersValidator implements Validator {
  public async validate(data: unknown, headers: Headers): Promise<ValidationResult> {
    const parsedHeaders: Record<string, string | undefined> = {
      Authorization: headers.get('Authorization') ?? undefined,
      'Content-Type': headers.get('Content-Type') ?? undefined,
      'Octo-Capabilities': headers.get('Octo-Capabilities') ?? undefined,
    };

    const validationResult = new ValidationResult(parsedHeaders);

    try {
      requestHeadersSchema.validateSync(parsedHeaders, { abortEarly: false, strict: true });
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
