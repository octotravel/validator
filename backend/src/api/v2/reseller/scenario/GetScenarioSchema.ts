import { mixed, object } from 'yup';
import { ScenarioId } from '../../../../common/validation/v2/scenario/ScenarioId';
import { $enum } from 'ts-enum-util';

export interface GetScenarioSchema {
  scenarioId: ScenarioId;
}

export const getScenarioSchema = object({
  scenarioId: mixed()
    .oneOf([...$enum(ScenarioId).getValues()])
    .required(),
});
