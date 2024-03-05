import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { SessionService } from '../../session/SessionService';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepProcessor } from '../../session/SessionStepProcessor';

@singleton()
export class SupplierFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepProcessor) private readonly sessionStepProcessor: SessionStepProcessor,
  ) {}

  public async getSupplier(sessionId: string): Promise<Supplier> {
    const session = await this.sessionService.getSession(sessionId);
    await this.sessionStepProcessor.process(session, this.getSupplierStep);

    return await this.backend.getSupplier(BackendParamsUtil.create());
  }
}
