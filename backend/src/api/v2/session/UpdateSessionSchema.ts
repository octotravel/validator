import { array, mixed, object, string } from 'yup';
import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { ScenarioId } from '../../../common/validation/v2/types/ScenarioId';
import { StepId } from '../../../common/validation/v2/types/StepId';

export interface UpdateSessionSchema {
  id: string;
  name?: string;
  capabilities?: CapabilityId[];
  currentScenario?: ScenarioId | null;
  currentStep?: StepId | null;
}

export const updateSessionSchema = object({
  id: string().uuid().required(),
  name: string()
    .optional()
    .min(3)
    .transform((value) => value || ''),
  capabilities: array()
    .of(mixed().oneOf([null, ...$enum(CapabilityId).getKeys()]))
    .optional(),
  currentScenario: mixed()
    .oneOf([null, ...$enum(ScenarioId).getValues()])
    .optional(),
  currentStep: mixed()
    .oneOf([null, ...$enum(StepId).getValues()])
    .optional(),
});
