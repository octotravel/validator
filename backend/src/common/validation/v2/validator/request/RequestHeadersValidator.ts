import { SchemaOf, ValidationError, object, string } from 'yup';
import { ValidationResult } from '../../ValidationResult';
import { octoCapabilitiesValidator } from '../../yup/RequiredHeaders';
import { Validator } from '../Validator';
import { ValidationFailureFactory } from '../../ValidationFailureFactory';

export interface RequestHeadersSchema {
  Authorization: string;
  'Content-Type': string;
  'Octo-Capabilities': string;
}

export const requestHeadersSchema: SchemaOf<RequestHeadersSchema> = object().shape({
  Authorization: string().required(),
  'Content-Type': string().required(),
  'Octo-Capabilities': octoCapabilitiesValidator.required(),
});

export class RequestHeadersValidator implements Validator {
  public async validate(headers: Headers): Promise<ValidationResult> {
    const parsedHeaders: Record<string, string | undefined> = {
      Authorization: headers.get('Authorization') ?? undefined,
      'Content-Type': headers.get('Content-Type') ?? undefined,
      'Octo-Capabilities': headers.get('Octo-Capabilities') ?? undefined,
    };

    const validationResult = new ValidationResult(parsedHeaders);

    try {
      requestHeadersSchema.validateSync(parsedHeaders, { abortEarly: false, strict: true });
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
