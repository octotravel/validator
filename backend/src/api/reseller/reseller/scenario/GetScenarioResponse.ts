import { CapabilityId } from '@octocloud/types';
import { Question } from '../../../../common/validation/reseller/question/Question';
import { ScenarioId } from '../../../../common/validation/reseller/scenario/ScenarioId';
import { StepId } from '../../../../common/validation/reseller/step/StepId';

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
  questions: GetScenarioStepQuestionResponse[];
  endpointMethod: string;
  endpointUrl: string;
  docsUrl: string;
}

export type GetScenarioStepQuestionResponse = Omit<Question, 'answer'>;
