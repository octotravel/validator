import { SchemaOf, ValidationError, object, string } from 'yup';
import { ValidationResult } from '../../ValidationResult';
import { octoCapabilitiesValidator } from '../../yup/RequiredHeaders';

export interface RequestHeadersSchema {
  Authorization: string;
  'Content-Type': string;
  'Octo-Capabilities': string;
}

export const requestHeadersSchema: SchemaOf<RequestHeadersSchema> = object().shape({
  Authorization: string().required(),
  'Content-Type': string().required(),
  'Octo-Capabilities': octoCapabilitiesValidator,
});

export class RequestHeadersValidator implements SpecificRequestValidator<Headers> {
  public getDocs(): string {
    return 'https://docs.octo.travel/getting-started/headers';
  }

  public async validate(headers: Headers): Promise<ValidationResult> {
    const parsedHeaders: Record<string, string | undefined> = {
      Authorization: headers.get('Authorization') ?? undefined,
      'Content-Type': headers.get('Content-Type') ?? undefined,
      'Octo-Capabilities': headers.get('Octo-Capabilities') ?? undefined,
    };

    try {
      requestHeadersSchema.validateSync(parsedHeaders, { abortEarly: false, strict: true });
    } catch (e: any) {
      if (e instanceof ValidationError) {
      }

      throw e;
    }

    return new ValidationResult();
  }
}
