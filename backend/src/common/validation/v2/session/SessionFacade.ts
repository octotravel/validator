import { SessionService } from './SessionService';
import { Session, SessionValidationHistory, SessionWithProgress, UpdateSessionData } from '../../../../types/Session';
import { SessionScenarioProgressProvider } from './SessionScenarioProgressProvider';
import { ScenarioId } from '../scenario/ScenarioId';
import { RequestLogRepository } from '../../../requestLog/RequestLogRepository';
import { SessionStepQuestionAnswersValidationProcessor } from './SessionStepQuestionAnswersValidationProcessor';
import { StepId } from '../step/StepId';
import { ValidationResult } from '../ValidationResult';
import { QuestionAnswer } from '../question/Question';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { inject } from '@needle-di/core';

export class SessionFacade {
  public constructor(
    private readonly sessionService: SessionService = inject(SessionService),
    private readonly sessionScenarioProgressProvider: SessionScenarioProgressProvider = inject(
      SessionScenarioProgressProvider,
    ),
    private readonly sessionStepQuestionAnswersValidationProcessor: SessionStepQuestionAnswersValidationProcessor = inject(
      SessionStepQuestionAnswersValidationProcessor,
    ),
    private readonly requestLogRepository: RequestLogRepository = inject<RequestLogRepository>('RequestLogRepository'),
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
      answers,
    );

    if (validationResult.isValid()) {
      await this.requestLogRepository.markCorrectlyAnsweredQuestions(latestRequestLogDetail.id);
    }

    return validationResult;
  }
}
