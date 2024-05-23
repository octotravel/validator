import { $enum } from 'ts-enum-util';
import { array, mixed, object, string } from 'yup';
import { ScenarioId } from '../../../common/validation/v2/scenario/ScenarioId';
import { StepId } from '../../../common/validation/v2/step/StepId';
import { QuestionAnswer } from '../../../common/validation/v2/question/Question';

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
