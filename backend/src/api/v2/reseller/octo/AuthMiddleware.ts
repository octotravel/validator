import { IRequest } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { ErrorCode } from '../../../http/error/ErrorCode';

@singleton()
export class AuthMiddleware {
  public constructor(@inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    const authHeader = request.headers.get('Authorization') ?? '';
    const [authType, sessionId] = authHeader.split(' ');

    if (authType !== 'Bearer' || !sessionId) {
      return this.errorResponseFactory.createUnauthorizedResponse(ErrorCode.INVALID_AUTH_HEADER);
    }

    request.sessionId = sessionId;

    // Alternative to calling .next() in the middleware in itty router
    return null;
  }
}
