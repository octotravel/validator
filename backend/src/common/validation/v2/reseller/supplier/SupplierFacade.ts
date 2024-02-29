import { inject, singleton } from 'tsyringe';
import { Backend, RequestContext } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { SessionService } from '../../session/SessionService';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { SessionStepGuard } from '../../session/SessionStepGuard';
import { RequestContextUtil } from '../../../../util/RequestContextUtil';
import { StepValidator } from '../../validator/StepValidator';
import { ScenarioService } from '../../scenario/ScenarioService';

@singleton()
export class SupplierFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(ScenarioService) private readonly scenarioService: ScenarioService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepValidator) private readonly stepValidator: StepValidator,
  ) {}

  public async getSupplier(sessionId: string): Promise<Supplier> {
    const session = await this.sessionService.getSession(sessionId);

    await this.sessionStepGuard.check(session, this.getSupplierStep);
    await this.sessionService.updateSession({
      id: sessionId,
      currentStep: this.getSupplierStep.getId(),
    });

    const validationResult = await this.stepValidator.validate(this.getSupplierStep, {});

    if (!validationResult.isValid()) {
      // todo: send validation result via socket
    }

    return await this.backend.getSupplier({
      ctx: RequestContextUtil.create(),
    });
  }
}
