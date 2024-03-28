import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { SessionResponse } from './SessionResponse';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { RequestHandler } from '../../http/request/RequestHandler';

@singleton()
export class CreateSessionHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(SessionFacade) private readonly sessionFacade: SessionFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const session = await this.sessionFacade.createSession();
    return this.jsonResponseFactory.create(SessionResponse.create(session));
  }
}
