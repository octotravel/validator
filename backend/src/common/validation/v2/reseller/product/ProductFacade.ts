import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Product } from '@octocloud/types';
import { SessionService } from '../../session/SessionService';
import { SessionStepGuard } from '../../session/SessionStepGuard';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { StepValidator } from '../../validator/StepValidator';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';

@singleton()
export class ProductFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetProductsStep) private readonly getProductsStep: GetProductsStep,
    @inject(GetProductStep) private readonly getProductStep: GetProductStep,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepValidator) private readonly stepValidator: StepValidator,
  ) {}

  public async getProducts(sessionId: string): Promise<Product[]> {
    const session = await this.sessionService.getSession(sessionId);

    await this.sessionStepGuard.check(session, this.getProductsStep);
    await this.sessionService.updateSession({
      id: sessionId,
      currentStep: this.getProductsStep.getId(),
    });

    const validationResult = await this.stepValidator.validate(this.getProductsStep, {});
    // send validation result via socket

    return await this.backend.getProducts({}, BackendParamsUtil.create());
  }

  public async getProduct(productId: string, sessionId: string): Promise<Product> {
    const session = await this.sessionService.getSession(sessionId);

    await this.sessionStepGuard.check(session, this.getProductStep);
    await this.sessionService.updateSession({
      id: sessionId,
      currentStep: this.getProductStep.getId(),
    });

    const validationResult = await this.stepValidator.validate(this.getProductStep, {});
    // send validation result via socket

    return await this.backend.getProduct({ id: productId }, BackendParamsUtil.create());
  }
}
