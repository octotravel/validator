import { CapabilityId } from '@octocloud/types';

export type GetScenariosResponse = GetScenariosScenarioResponse[];

export interface GetScenariosScenarioResponse {
  id: string;
  name: string;
  description: string;
  requiredCapabilities: CapabilityId[];
  optionalCapabilities: CapabilityId[];
}
