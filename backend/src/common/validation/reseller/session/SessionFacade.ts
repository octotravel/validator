import { inject } from '@needle-di/core';
import { Session, SessionValidationHistory, SessionWithProgress, UpdateSessionData } from '../../../../types/Session';
import { ResellerRequestLogRepository } from '../../../requestLog/reseller/ResellerRequestLogRepository';
import { QuestionAnswer } from '../question/Question';
import { ScenarioId } from '../scenario/ScenarioId';
import { StepId } from '../step/StepId';
import { ValidationResult } from '../ValidationResult';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { SessionScenarioProgressProvider } from './SessionScenarioProgressProvider';
import { SessionService } from './SessionService';
import { SessionStepQuestionAnswersValidationProcessor } from './SessionStepQuestionAnswersValidationProcessor';

export class SessionFacade {
  public constructor(
    private readonly sessionService = inject(SessionService),
    private readonly sessionScenarioProgressProvider = inject(SessionScenarioProgressProvider),
    private readonly sessionStepQuestionAnswersValidationProcessor = inject(
      SessionStepQuestionAnswersValidationProcessor,
    ),
    private readonly requestLogRepository = inject<ResellerRequestLogRepository>('ResellerRequestLogRepository'),
  ) {}

  public async createSession(): Promise<Session> {
    return await this.sessionService.createSession();
  }

  public async updateSession(updateSessionData: UpdateSessionData): Promise<Session> {
    return await this.sessionService.updateSession(updateSessionData);
  }

  public async getSession(sessionId: string): Promise<SessionWithProgress> {
    const session = await this.sessionService.getSession(sessionId);
    const sessionScenariosProgress: SessionWithProgress = {
      ...session,
      scenariosProgress: await this.sessionScenarioProgressProvider.getSessionScenarioProgress(session),
    };

    return sessionScenariosProgress;
  }

  public async getValidationHistoryForScenario(
    sessionId: string,
    scenarioId: ScenarioId,
  ): Promise<SessionValidationHistory[]> {
    const requestLogDetails = await this.requestLogRepository.getAllForScenario(scenarioId, sessionId);

    return requestLogDetails.map((requestLogDetail) => {
      return {
        stepId: requestLogDetail.stepId,
        createdAt: requestLogDetail.createdAt,
        reqHeaders: JSON.parse(requestLogDetail.reqHeaders) as Record<string, string>,
        reqBody: JSON.parse(JSON.stringify(requestLogDetail.reqBody)),
        validationResult: JSON.parse(requestLogDetail.validationResult),
        isValid: requestLogDetail.isValid,
      };
    });
  }

  public async validateQuestionAnswers(
    sessionId: string,
    scenarioId: ScenarioId,
    stepId: StepId,
    answers: QuestionAnswer[],
  ): Promise<ValidationResult> {
    const latestRequestLogDetail = await this.requestLogRepository.getLatestForScenarioAndStep(
      scenarioId,
      stepId,
      sessionId,
    );

    if (latestRequestLogDetail === null || !latestRequestLogDetail.isValid) {
      // TODO maybe diff error?
      throw SessionScenarioStepNotAllowedError.createForInvalidStep(scenarioId, stepId);
    }

    const validationResult = await this.sessionStepQuestionAnswersValidationProcessor.process(
      sessionId,
      scenarioId,
      stepId,
      latestRequestLogDetail,
      answers,
    );

    if (validationResult.isValid()) {
      await this.requestLogRepository.markCorrectlyAnsweredQuestions(latestRequestLogDetail.id);
    }

    return validationResult;
  }
}
