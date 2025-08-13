import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { RequestScopedContextProvider } from '../../../../common/requestContext/RequestScopedContextProvider';
import { ResellerRequestLogFactory } from '../../../../common/requestLog/reseller/ResellerRequestLogFactory';
import { ResellerRequestLogService } from '../../../../common/requestLog/reseller/ResellerRequestLogService';

export class RequestLoggerMiddleware {
  public constructor(
    private readonly requestLogService = inject(ResellerRequestLogService),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async invoke(response: Response, _request: IRequest): Promise<void> {
    // TODO handle differently?
    if (!response || !response.ok) {
      return;
    }

    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    requestScopedContext.setResponse(response);

    const requestLog = await ResellerRequestLogFactory.createFromContext(requestScopedContext);
    await this.requestLogService.logRequest(requestLog);
  }
}
