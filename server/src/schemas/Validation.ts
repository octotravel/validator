import * as yup from "npm:yup@^0.32.11";

export interface ValidationEndpoint {
  backend: {
    endpoint: string;
    apiKey: string;
  };
}

export const validationConfigSchema: yup.SchemaOf<ValidationEndpoint> = yup
  .object()
  .shape({
    backend: yup.object().shape({
      endpoint: yup.string().required(),
      apiKey: yup.string().required(),
    }),
  })
  .required();
