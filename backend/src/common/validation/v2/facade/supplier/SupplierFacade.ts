import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';

@singleton()
export class SupplierFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
  ) {}

  public async getSupplier(): Promise<Supplier> {
    await this.sessionStepValidationProcessor.process(this.getSupplierStep, null);
    return await this.backend.getSupplier({
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }
}
