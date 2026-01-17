import { $enum } from 'ts-enum-util';
import { array, mixed, object, string } from 'yup';
import { QuestionAnswer } from '../../../common/validation/reseller/question/Question';
import { ScenarioId } from '../../../common/validation/reseller/scenario/ScenarioId';
import { StepId } from '../../../common/validation/reseller/step/StepId';

export interface ValidateSessionQuestionAnswersSchema {
  sessionId: string;
  scenarioId: ScenarioId;
  stepId: StepId;
  answers: QuestionAnswer[];
}

export const validateSessionQuestionAnswersSchema = object({
  sessionId: string().uuid().required(),
  scenarioId: mixed()
    .oneOf([...$enum(ScenarioId).getValues()])
    .required(),
  stepId: mixed()
    .oneOf([...$enum(StepId).getValues()])
    .required(),
  answers: array()
    .of(
      object().shape({
        questionId: string().required(),
        value: mixed().required(),
      }),
    )
    .required(),
});
