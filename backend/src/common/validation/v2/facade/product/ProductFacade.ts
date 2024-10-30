import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Product } from '@octocloud/types';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';

@singleton()
export class ProductFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetProductsStep) private readonly getProductsStep: GetProductsStep,
    @inject(GetProductStep) private readonly getProductStep: GetProductStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
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
