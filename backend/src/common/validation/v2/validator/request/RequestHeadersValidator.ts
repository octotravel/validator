import { SchemaOf, ValidationError, object, string } from 'yup';
import { ValidationResult } from '../../ValidationResult';
import { octoCapabilitiesValidator } from '../../yup/RequiredHeaders';
import { Validator } from '../Validator';
import { ValidationFailure } from '../../ValidationFailure';
import { getProductPathParamsSchema } from '@octocloud/types';

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
  public getDocs(): string {
    return 'https://docs.octo.travel/getting-started/headers';
  }

  public async validate(headers: Headers): Promise<ValidationResult> {
    const parsedHeaders: Record<string, string | undefined> = {
      Authorization: headers.get('Authorization') ?? undefined,
      'Content-Type': headers.get('Content-Type') ?? undefined,
      'Octo-Capabilities': headers.get('Octo-Capabilities') ?? undefined,
    };

    const validationResult = new ValidationResult(headers);

    try {
      requestHeadersSchema.validateSync(parsedHeaders, { abortEarly: false, strict: true });
    } catch (e: any) {
      if (e instanceof ValidationError) {
        console.log(e.inner);
        const validationFailure = new ValidationFailure(e.path ?? '', e.message, e.value);
        validationResult.addError(validationFailure);
      }
    }

    return validationResult;
  }
}
