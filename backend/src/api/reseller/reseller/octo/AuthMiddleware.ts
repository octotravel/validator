import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { RequestScopedContextProvider } from '../../../../common/requestContext/RequestScopedContextProvider';
import { SessionNotFoundError } from '../../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionService } from '../../../../common/validation/v2/session/SessionService';
import { Session } from '../../../../types/Session';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';

export class AuthMiddleware {
  public constructor(
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
    private readonly sessionService = inject(SessionService),
  ) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    const authHeader = request.headers.get('Authorization') ?? '';
    const [authType, sessionId] = authHeader.split(' ');

    if (authType !== 'Bearer' || !sessionId) {
      return this.errorResponseFactory.createUnauthorizedResponse(
        "You didn't send the API Key in the Authorization header to an endpoint that requires authentication.",
      );
    }

    let session: Session;

    try {
      session = await this.sessionService.getSession(sessionId);
    } catch (e: unknown) {
      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createUnauthorizedResponse('API Key in the Authorization header is invalid.');
      }

      // TODO check if this will be handled later correctly as 500
      throw e;
    }

    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    requestScopedContext.setSession(session);

    // Alternative to calling .next() in the middleware in itty router
    return null;
  }
}
