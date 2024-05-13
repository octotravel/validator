import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepQuestionAnswersValidator } from '../step/StepQuestionAnswersValidator';
import { ScenarioId } from '../scenario/ScenarioId';
import { StepId } from '../step/StepId';
import { ValidationResult } from '../ValidationResult';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { QuestionAnswer } from '../question/Question';

@singleton()
export class SessionStepQuestionAnswerProcessor {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(ScenarioService) private readonly scenarioService: ScenarioService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepQuestionAnswersValidator) private readonly stepQuestionAnswersValidator: StepQuestionAnswersValidator,
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

    if (validationResult.isValid()) {
      const currentStepNode = scenario.getSteps().getNode(step);
      const nextStepNode = currentStepNode?.next ?? null;

      if (nextStepNode !== null) {
        await this.sessionService.updateSessionStep(session.id, nextStepNode.value.getId());
      }
    }

    return validationResult;
  }
}
