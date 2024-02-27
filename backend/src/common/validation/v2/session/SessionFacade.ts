import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { Session, UpdateSessionData } from '../../../../types/Session';

@singleton()
export class SessionFacade {
  public constructor(@inject(SessionService) private readonly sessionService: SessionService) {}

  public async createSession(): Promise<Session> {
    return await this.sessionService.createSession();
  }

  public async updateSession(updateSessionData: UpdateSessionData): Promise<Session> {
    return await this.sessionService.updateSession(updateSessionData);
  }

  public async getSession(sessionId: string): Promise<Session> {
    return await this.sessionService.getSession(sessionId);
  }
}
