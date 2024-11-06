import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepQuestionAnswersValidator } from '../step/StepQuestionAnswersValidator';
import { ScenarioId } from '../scenario/ScenarioId';
import { StepId } from '../step/StepId';
import { ValidationResult } from '../ValidationResult';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { QuestionAnswer } from '../question/Question';
import { inject } from '@needle-di/core';

export class SessionStepQuestionAnswersValidationProcessor {
  public constructor(
    private readonly sessionService: SessionService = inject(SessionService),
    private readonly scenarioService: ScenarioService = inject(ScenarioService),
    private readonly sessionStepGuard: SessionStepGuard = inject(SessionStepGuard),
    private readonly stepQuestionAnswersValidator: StepQuestionAnswersValidator = inject(StepQuestionAnswersValidator),
  ) {}

  public async process(
    sessionId: string,
    scenarioId: ScenarioId,
    stepId: StepId,
    answers: QuestionAnswer[],
  ): Promise<ValidationResult> {
    const session = await this.sessionService.getSession(sessionId);
    const scenario = await this.scenarioService.getScenarioById(scenarioId);
    const step = scenario.getSteps().find((step) => step.getId() === stepId) ?? null;

    if (step === null) {
      throw SessionScenarioStepNotAllowedError.createForInvalidStep(scenarioId, stepId);
    }

    await this.sessionStepGuard.check(session, step);
    const validationResult = await this.stepQuestionAnswersValidator.validate(step, answers);

    return validationResult;
  }
}
