import { IRequest } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { SessionFacade } from '../../../../common/validation/v2/session/SessionFacade';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { ErrorCode } from '../../../http/error/ErrorCode';

@singleton()
export class AuthMiddleware {
  public constructor(
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(SessionFacade) private readonly sessionFacade: SessionFacade,
  ) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    const authHeader = request.headers.get('Authorization') ?? '';
    const [authType, sessionId] = authHeader.split(' ');

    if (authType !== 'Bearer' || !sessionId) {
      return this.errorResponseFactory.createUnauthorizedResponse(ErrorCode.INVALID_AUTH_HEADER);
    }

    const session = this.sessionFacade.getSession(sessionId);

    if (session === null) {
      return this.errorResponseFactory.createUnauthorizedResponse(ErrorCode.INVALID_AUTH_HEADER);
    }

    request.params.sessionId = sessionId;

    // Alternative to calling .next() in the middleware in itty router
    return null;
  }
}
