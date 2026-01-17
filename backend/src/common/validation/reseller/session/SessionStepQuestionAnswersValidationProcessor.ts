import { inject } from '@needle-di/core';
import { RequestLogLatestDetail } from '../../../requestLog/reseller/ResellerRequestLogRepository';
import { QuestionAnswer } from '../question/Question';
import { ScenarioId } from '../scenario/ScenarioId';
import { ScenarioService } from '../scenario/ScenarioService';
import { StepId } from '../step/StepId';
import { StepQuestionAnswersValidator } from '../step/StepQuestionAnswersValidator';
import { ValidationResult } from '../ValidationResult';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';

export class SessionStepQuestionAnswersValidationProcessor {
  public constructor(
    private readonly sessionService = inject(SessionService),
    private readonly scenarioService = inject(ScenarioService),
    private readonly sessionStepGuard = inject(SessionStepGuard),
    private readonly stepQuestionAnswersValidator = inject(StepQuestionAnswersValidator),
  ) {}

  public async process(
    sessionId: string,
    scenarioId: ScenarioId,
    stepId: StepId,
    requestLogDetail: RequestLogLatestDetail,
    answers: QuestionAnswer[],
  ): Promise<ValidationResult> {
    const session = await this.sessionService.getSession(sessionId);
    const scenario = await this.scenarioService.getScenarioById(scenarioId);
    const step = scenario.getSteps().find((step) => step.getId() === stepId) ?? null;

    if (step === null) {
      throw SessionScenarioStepNotAllowedError.createForInvalidStep(scenarioId, stepId);
    }

    await this.sessionStepGuard.check(session, step);
    const validationResult = await this.stepQuestionAnswersValidator.validate(step, requestLogDetail, answers);

    return validationResult;
  }
}
