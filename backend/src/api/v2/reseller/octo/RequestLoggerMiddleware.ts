import { inject, singleton } from 'tsyringe';
import { RequestLogService } from '../../../../common/requestLog/RequestLogService';
import { RequestScopedContextProvider } from '../../../../common/requestContext/RequestScopedContextProvider';
import { IRequest } from 'itty-router';
import { RequestLogFactory } from '../../../../common/requestLog/RequestLogFactory';

@singleton()
export class RequestLoggerMiddleware {
  public constructor(
    @inject(RequestLogService) private readonly requestLogService: RequestLogService,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
  ) {}

  public async invoke(response: Response, request: IRequest): Promise<void> {
    // TODO handle differently?
    if (!response || !response.ok) {
      return;
    }

    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    requestScopedContext.setResponse(response);

    const requestLog = await RequestLogFactory.createFromContext(requestScopedContext);
    await this.requestLogService.logRequest(requestLog);
  }
}
