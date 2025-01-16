import { inject, injectable } from '@needle-di/core';
import { Backend } from '@octocloud/core';
import { Product } from '@octocloud/types';
import { OCTO_BACKEND } from '../../../../di/container';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';

@injectable()
export class ProductFacade {
  public constructor(
    private readonly backend = inject<Backend>(OCTO_BACKEND),
    private readonly getProductsStep = inject(GetProductsStep),
    private readonly getProductStep = inject(GetProductStep),
    private readonly sessionStepValidationProcessor = inject(SessionStepValidationProcessor),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
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
