import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { Session, SessionValidationHistory, SessionWithProgress, UpdateSessionData } from '../../../../types/Session';
import { SessionScenarioProgressProvider } from './SessionScenarioProgressProvider';
import { ScenarioId } from '../scenario/ScenarioId';
import { RequestLogRepository } from '../../../requestLog/RequestLogRepository';

@singleton()
export class SessionFacade {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionScenarioProgressProvider)
    private readonly sessionScenarioProgressProvider: SessionScenarioProgressProvider,
    @inject('RequestLogRepository') private readonly requestLogRepository: RequestLogRepository,
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
    scenarioId: ScenarioId,
    sessionId: string,
  ): Promise<SessionValidationHistory[]> {
    const requestLogDetails = await this.requestLogRepository.getAllForScenario(scenarioId, sessionId);

    return requestLogDetails.map((requestLogDetail) => {
      return {
        stepId: requestLogDetail.stepId,
        reqHeaders: JSON.parse(requestLogDetail.reqHeaders) as Record<string, string>,
        reqBody: JSON.parse(JSON.stringify(requestLogDetail.reqBody)),
        validationResult: JSON.parse(requestLogDetail.validationResult),
        isValid: requestLogDetail.isValid,
      }
    });
  }
}
