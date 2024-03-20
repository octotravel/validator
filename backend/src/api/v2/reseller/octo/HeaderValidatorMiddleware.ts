import { IRequest } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { RequestHeadersValidator } from '../../../../common/validation/v2/validator/request/RequestHeadersValidator';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { WebSocket } from '../../../../common/socketio/WebSocket';

@singleton()
export class HeaderValidatorMiddleware {
  public constructor(
    @inject('WebSocket') private readonly webSocket: WebSocket,
    @inject(RequestHeadersValidator) private readonly requestHeadersValidator: RequestHeadersValidator,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
  ) {}

  public async invoke(request: IRequest): Promise<Response | null> {
    const validationResult = await this.requestHeadersValidator.validate(request.headers);

    if (!validationResult.isValid()) {
      const sessionId = request.headers.get('Authorization');

      if (sessionId !== null) {
        this.webSocket.sendValidationResult(sessionId, validationResult);
      }

      return this.errorResponseFactory.createValidationErrorResponse(validationResult);
    }

    return null;
  }
}
