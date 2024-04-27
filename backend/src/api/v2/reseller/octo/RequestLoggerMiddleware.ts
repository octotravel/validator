import { inject, singleton } from 'tsyringe';
import { RequestLogService } from '../../../../common/requestLog/RequestLogService';
import { RequestScopedContextProvider } from '../../../../common/requestContext/RequestScopedContextProvider';
import { IRequest } from 'itty-router';

@singleton()
export class RequestLoggerMiddleware {
  public constructor(
    @inject(RequestLogService) private readonly requestLogService: RequestLogService,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
  ) {}

  public async invoke(response: Response, request: IRequest): Promise<void> {
    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    requestScopedContext.setResponse(response);
    await this.requestLogService.logRequestFromContext(requestScopedContext);
  }
}
