import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { Session, SessionWithProgress, UpdateSessionData } from '../../../../types/Session';
import { SessionScenarioProgressProvider } from './SessionScenarioProgressProvider';

@singleton()
export class SessionFacade {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionScenarioProgressProvider)
    private readonly sessionScenarioProgressProvider: SessionScenarioProgressProvider,
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
}
