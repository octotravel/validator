import { inject } from '@needle-di/core';
import { OctoBackend } from '@octocloud/backend';
import { Product } from '@octocloud/types';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';

export class ProductFacade {
  public constructor(
    private readonly backend = inject<OctoBackend>('OctoBackend'),
    private readonly getProductsStep = inject(GetProductsStep),
    private readonly getProductStep = inject(GetProductStep),
    private readonly sessionStepValidationProcessor = inject(SessionStepValidationProcessor),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async getProducts(): Promise<Product[]> {
    await this.sessionStepValidationProcessor.process(this.getProductsStep, null);
    return (await this.backend.getProducts(
      {},
      { ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext() },
    )) as Product[];
  }

  public async getProduct(productId: string): Promise<Product> {
    await this.sessionStepValidationProcessor.process(this.getProductStep, null);
    return (await this.backend.getProduct(
      { id: productId },
      { ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext() },
    )) as Product;
  }
}
