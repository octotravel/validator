import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { SessionResponse } from './SessionResponse';

export class CreateSessionHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly sessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const session = await this.sessionFacade.createSession();
    return this.jsonResponseFactory.create(SessionResponse.create(session));
  }
}
