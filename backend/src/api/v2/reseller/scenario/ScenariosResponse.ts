import { CapabilityId } from '@octocloud/types';

export type ScenariosResponse = ScenarioResponse[];

export interface ScenarioResponse {
  id: string;
  name: string;
  description: string;
  requiredCapabilities: CapabilityId[];
  optionalCapabilities: CapabilityId[];
}
