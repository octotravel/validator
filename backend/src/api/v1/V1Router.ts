import { IRequest, Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { ValidateHandler } from './validate/ValidateHandler';
import { RequestScopedContextProvider } from '../../common/requestContext/RequestScopedContextProvider';

@singleton()
export class V1Router {
  public readonly router;

  public constructor(
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
    @inject(ValidateHandler) private readonly validateHandler: ValidateHandler,
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
