import { object, string } from 'yup';

export interface ValidationEndpoint {
  backend: {
    endpoint: string;
    headers: Record<string, string>;
  };
}

export const validationConfigSchema = object({
  backend: object()
    .shape({
      endpoint: string().required(),
      headers: object()
        .test('headers', 'headers must be an object with string keys and string values', (value) => {
          return (
            typeof value === 'object' && value !== null && Object.values(value).every((val) => typeof val === 'string')
          );
        })
        .required(),
    })
    .required(),
});
