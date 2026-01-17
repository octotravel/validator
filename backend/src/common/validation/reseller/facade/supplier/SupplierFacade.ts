import { inject } from '@needle-di/core';
import { OctoBackend } from '@octocloud/backend';
import { Supplier } from '@octocloud/types';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';

export class SupplierFacade {
  public constructor(
    private readonly backend = inject<OctoBackend>('OctoBackend'),
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
