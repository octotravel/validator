import { inject } from '@needle-di/core';
import { Backend } from '@octocloud/core';
import { Product } from '@octocloud/types';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';

export class ProductFacade {
  public constructor(
    private readonly backend: Backend = inject<Backend>('Backend'),
    private readonly getProductsStep: GetProductsStep = inject(GetProductsStep),
    private readonly getProductStep: GetProductStep = inject(GetProductStep),
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor = inject(
      SessionStepValidationProcessor,
    ),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async getProducts(): Promise<Product[]> {
    await this.sessionStepValidationProcessor.process(this.getProductsStep, null);
    return await this.backend.getProducts(
      {},
      { ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext() },
    );
  }

  public async getProduct(productId: string): Promise<Product> {
    await this.sessionStepValidationProcessor.process(this.getProductStep, null);
    return await this.backend.getProduct(
      { id: productId },
      { ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext() },
    );
  }
}
