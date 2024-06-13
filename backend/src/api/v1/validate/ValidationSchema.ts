import { object, string } from 'yup';

export interface ValidationEndpoint {
  backend: {
    endpoint: string;
    apiKey: string;
  };
}

export const validationConfigSchema = object({
  backend: object()
    .shape({
      endpoint: string().required(),
      apiKey: string().required(),
    })
    .required(),
});
