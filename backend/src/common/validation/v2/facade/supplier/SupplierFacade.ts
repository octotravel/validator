import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';

@singleton()
export class SupplierFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
  ) {}

  public async getSupplier(): Promise<Supplier> {
    await this.sessionStepValidationProcessor.process(this.getSupplierStep, null);
    return await this.backend.getSupplier(BackendParamsUtil.create());
  }
}
