import { Backend } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { inject } from '@needle-di/core';

export class SupplierFacade {
  public constructor(
    private readonly backend: Backend = inject<Backend>('Backend'),
    private readonly getSupplierStep: GetSupplierStep = inject(GetSupplierStep),
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor = inject(
      SessionStepValidationProcessor,
    ),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async getSupplier(): Promise<Supplier> {
    await this.sessionStepValidationProcessor.process(this.getSupplierStep, null);
    return await this.backend.getSupplier({
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }
}
