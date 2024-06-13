import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Product } from '@octocloud/types';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';

@singleton()
export class ProductFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetProductsStep) private readonly getProductsStep: GetProductsStep,
    @inject(GetProductStep) private readonly getProductStep: GetProductStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
  ) {}

  public async getProducts(): Promise<Product[]> {
    await this.sessionStepValidationProcessor.process(this.getProductsStep, null);
    return await this.backend.getProducts({}, BackendParamsUtil.create());
  }

  public async getProduct(productId: string): Promise<Product> {
    await this.sessionStepValidationProcessor.process(this.getProductStep, null);
    return await this.backend.getProduct({ id: productId }, BackendParamsUtil.create());
  }
}
