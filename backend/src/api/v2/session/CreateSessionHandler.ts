import { IRequest } from 'itty-router';
import { SessionResponse } from './SessionResponse';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { RequestHandler } from '../../http/request/RequestHandler';
import { inject } from '@needle-di/core';

export class CreateSessionHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly sessionFacade: SessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const session = await this.sessionFacade.createSession();
    return this.jsonResponseFactory.create(SessionResponse.create(session));
  }
}
