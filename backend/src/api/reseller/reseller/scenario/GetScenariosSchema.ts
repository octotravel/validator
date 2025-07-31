import { object, SchemaOf } from 'yup';
import { octoCapabilitiesValidator } from '../../../../common/validation/v2/yup/RequiredHeaders';

export interface GetScenariosSchema {
  'Octo-Capabilities': string;
}

export const getScenariosSchema: SchemaOf<GetScenariosSchema> = object().shape({
  'Octo-Capabilities': octoCapabilitiesValidator.defined().transform((value) => value || ''),
});
