import { CapabilityId } from '@octocloud/types';
import { ScenarioId } from '../../../../common/validation/v2/types/ScenarioId';
import { StepId } from '../../../../common/validation/v2/step/StepId';

export interface GetScenarioResponse {
  id: ScenarioId;
  name: string;
  description: string;
  requiredCapabilities: CapabilityId[];
  optionalCapabilities: CapabilityId[];
  steps: GetScenarioStepResponse[];
}

export interface GetScenarioStepResponse {
  id: StepId;
  name: string;
  description: string;
  docsUrl: string;
}
