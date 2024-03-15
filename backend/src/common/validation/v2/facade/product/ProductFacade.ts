import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Product } from '@octocloud/types';
import { SessionService } from '../../session/SessionService';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { SessionStepProcessor } from '../../session/SessionStepProcessor';

@singleton()
export class ProductFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetProductsStep) private readonly getProductsStep: GetProductsStep,
    @inject(GetProductStep) private readonly getProductStep: GetProductStep,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepProcessor) private readonly sessionStepProcessor: SessionStepProcessor,
  ) {}

  public async getProducts(sessionId: string): Promise<Product[]> {
    const session = await this.sessionService.getSession(sessionId);
    await this.sessionStepProcessor.process(session, this.getProductsStep);

    return await this.backend.getProducts({}, BackendParamsUtil.create());
  }

  public async getProduct(productId: string, sessionId: string): Promise<Product> {
    const session = await this.sessionService.getSession(sessionId);
    await this.sessionStepProcessor.process(session, this.getProductStep);

    return await this.backend.getProduct({ id: productId }, BackendParamsUtil.create());
  }
}
