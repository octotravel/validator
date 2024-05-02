import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepProcessor } from '../../session/SessionStepProcessor';

@singleton()
export class SupplierFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(SessionStepProcessor) private readonly sessionStepProcessor: SessionStepProcessor,
  ) {}

  public async getSupplier(): Promise<Supplier> {
    await this.sessionStepProcessor.process(this.getSupplierStep, null);
    return await this.backend.getSupplier(BackendParamsUtil.create());
  }
}
