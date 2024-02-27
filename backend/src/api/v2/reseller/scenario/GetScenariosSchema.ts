import { SchemaOf, object } from 'yup';
import { octoCapabilitiesValidator } from '../../../../common/validation/v2/yup/RequiredHeaders';

export interface GetScenariosSchema {
  capabilities: string;
}

export const getScenariosSchema: SchemaOf<GetScenariosSchema> = object().shape({
  capabilities: octoCapabilitiesValidator.required(),
});
