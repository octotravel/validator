import { IRequest } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';

@singleton()
export class AuthMiddleware {
  public constructor(@inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    const authHeader = request.headers.get('Authorization') ?? '';
    const [authType, sessionId] = authHeader.split(' ');

    if (authType !== 'Bearer' || !sessionId) {
      return this.errorResponseFactory.createUnauthorizedResponse(
        "You didn't send the API Key in the Authorization header to an endpoint that requires authentication.",
      );
    }

    request.sessionId = sessionId;

    // Alternative to calling .next() in the middleware in itty router
    return null;
  }
}
