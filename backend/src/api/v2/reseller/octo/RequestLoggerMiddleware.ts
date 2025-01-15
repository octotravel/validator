import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { RequestScopedContextProvider } from '../../../../common/requestContext/RequestScopedContextProvider';
import { RequestLogFactory } from '../../../../common/requestLog/RequestLogFactory';
import { RequestLogService } from '../../../../common/requestLog/RequestLogService';

export class RequestLoggerMiddleware {
  public constructor(
    private readonly requestLogService: RequestLogService = inject(RequestLogService),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
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
