import { inject, injectable } from '@needle-di/core';
import { Backend } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { OCTO_BACKEND } from '../../../../di/container';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';

@injectable()
export class SupplierFacade {
  public constructor(
    private readonly backend = inject<Backend>(OCTO_BACKEND),
    private readonly getSupplierStep = inject(GetSupplierStep),
    private readonly sessionStepValidationProcessor = inject(SessionStepValidationProcessor),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async getSupplier(): Promise<Supplier> {
    await this.sessionStepValidationProcessor.process(this.getSupplierStep, null);
    return await this.backend.getSupplier({
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }
}
