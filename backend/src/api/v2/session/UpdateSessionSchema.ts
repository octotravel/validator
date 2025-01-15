import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { array, mixed, object, string } from 'yup';
import { ScenarioId } from '../../../common/validation/v2/scenario/ScenarioId';

export interface UpdateSessionSchema {
  id: string;
  name?: string;
  capabilities?: CapabilityId[];
  currentScenario?: ScenarioId | null;
}

export const updateSessionSchema = object({
  id: string().uuid().required(),
  name: string()
    .optional()
    .min(3)
    .transform((value) => value || ''),
  capabilities: array()
    .of(mixed().oneOf([null, ...$enum(CapabilityId).getValues()]))
    .optional(),
  currentScenario: mixed()
    .oneOf([null, ...$enum(ScenarioId).getValues()])
    .optional(),
});
