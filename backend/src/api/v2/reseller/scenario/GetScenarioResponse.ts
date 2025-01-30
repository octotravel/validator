import { CapabilityId } from '@octocloud/types';
import { Question } from '../../../../common/validation/v2/question/Question';
import { ScenarioId } from '../../../../common/validation/v2/scenario/ScenarioId';
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
  questions: GetScenarioStepQuestionResponse[];
  endpointMethod: string;
  endpointUrl: string;
  docsUrl: string;
}

export type GetScenarioStepQuestionResponse = Omit<Question, 'answer'>;
