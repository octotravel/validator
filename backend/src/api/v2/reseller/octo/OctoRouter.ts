import { Router } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { GetSupplierHandler } from './supplier/GetSupplierHandler';
import { AuthMiddleware } from './AuthMiddleware';
import { HeaderValidatorMiddleware } from './HeaderValidatorMiddleware';
import { GetProductsHandler } from './product/GetProductsHandler';
import { GetProductHandler } from './product/GetProductHandler';

@singleton()
export class OctoRouter {
  public readonly router;

  public constructor(
    @inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware,
    @inject(HeaderValidatorMiddleware) private readonly headerValidatorMiddleware: HeaderValidatorMiddleware,
    @inject(GetSupplierHandler) private readonly getSupplierHandler: GetSupplierHandler,
    @inject(GetProductsHandler) private readonly getProductsHandler: GetProductsHandler,
    @inject(GetProductHandler) private readonly getProductHandler: GetProductsHandler,
  ) {
    this.router = Router({ base: '/v2/reseller/octo' });

    this.router.all('*', async (request) => {
      return await this.headerValidatorMiddleware.invoke(request);
    });
    this.router.all('*', async (request) => {
      await this.authMiddleware.invoke(request);
    });

    this.router.get('/supplier', async (request) => await this.getSupplierHandler.handleRequest(request));
    this.router.get('/products', async (request) => await this.getProductsHandler.handleRequest(request));
    this.router.get('/products/:productId', async (request) => await this.getProductHandler.handleRequest(request));
  }
}
