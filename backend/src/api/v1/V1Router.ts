import { IRequest, Router } from 'itty-router';

import { inject } from '@needle-di/core';
import { RequestScopedContextProvider } from '../../common/requestContext/RequestScopedContextProvider';
import { ValidateHandler } from './validate/ValidateHandler';

export class V1Router {
  public readonly router;

  public constructor(
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
    private readonly validateHandler: ValidateHandler = inject(ValidateHandler),
  ) {
    this.router = Router({
      base: '/v1',
      before: [
        async (req: IRequest): Promise<null> => {
          const ventrataRequestContext = this.requestScopedContextProvider
            .getRequestScopedContext()
            .getVentrataRequestContext();
          ventrataRequestContext.setChannel('Octo Supplier Validator');
          ventrataRequestContext.setAction('Validate');
          return null;
        },
      ],
    });
    this.router.post('/validate', async (request) => await this.validateHandler.handleRequest(request));
  }
}
