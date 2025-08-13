import { inject } from '@needle-di/core';
import { IRequest, Router } from 'itty-router';
import { RequestScopedContextProvider } from '../../common/requestContext/RequestScopedContextProvider';
import { ValidateHandler } from './validate/ValidateHandler';

export class SupplierRouter {
  public readonly router;

  public constructor(
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
    private readonly validateHandler = inject(ValidateHandler),
  ) {
    this.router = Router({
      base: '/supplier',
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
