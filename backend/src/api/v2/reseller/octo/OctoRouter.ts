import { Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { GetSupplierHandler } from './supplier/GetSupplierHandler';
import { AuthMiddleware } from './AuthMiddleware';
import { HeaderValidatorMiddleware } from './HeaderValidatorMiddleware';

@singleton()
export class OctoRouter {
  public readonly router;

  public constructor(
    @inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware,
    @inject(HeaderValidatorMiddleware) private readonly headerValidatorMiddleware: HeaderValidatorMiddleware,
    @inject(GetSupplierHandler) private readonly getSupplierHandler: GetSupplierHandler,
  ) {
    this.router = Router({ base: '/v2/reseller/octo' });

    this.router.all('*', async (request) => {
      return await this.headerValidatorMiddleware.invoke(request);
    });
    this.router.all('*', async (request) => {
      await this.authMiddleware.invoke(request);
    });

    this.router.get('/supplier', async (request) => await this.getSupplierHandler.handleRequest(request));
  }
}
