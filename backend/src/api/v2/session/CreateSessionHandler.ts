import { singleton, inject } from 'tsyringe';
import { SessionFacade } from '../../../common/session/SessionFacade';
import { IRequest } from 'itty-router';
import { SessionResponse } from './SessionResponse';

@singleton()
export class CreateSessionHandler {
  public constructor(@inject(SessionFacade) private readonly sessionFacade: SessionFacade) {}

  public async handleRequest(request: IRequest): Promise<SessionResponse> {
    const session = await this.sessionFacade.createSession();
    return SessionResponse.create(session);
  }
}