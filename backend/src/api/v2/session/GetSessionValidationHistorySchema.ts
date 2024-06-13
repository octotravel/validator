import { $enum } from 'ts-enum-util';
import { mixed, object, string } from 'yup';
import { ScenarioId } from '../../../common/validation/v2/scenario/ScenarioId';

export interface GetSessionValidationHistorySchema {
  sessionId: string;
  scenarioId: ScenarioId;
}

export const getSessionValidationHistorySchema = object({
  sessionId: string().uuid().required(),
  scenarioId: mixed()
    .oneOf([...$enum(ScenarioId).getValues()])
    .required(),
});
