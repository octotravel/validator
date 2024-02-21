import { singleton, inject } from 'tsyringe';
import { SessionFacade } from '../../../common/session/SessionFacade';
import { IRequest } from 'itty-router';
import { Session } from '../../../types/Session';

@singleton()
export class CreateSessionHandler {
  public constructor(@inject(SessionFacade) private readonly sessionFacade: SessionFacade) {}

  public async handleRequest(request: IRequest): Promise<Session> {
    return await this.sessionFacade.createSession();
  }
}
