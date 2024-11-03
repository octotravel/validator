import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Availability, AvailabilityCalendar } from '@octocloud/types';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../../step/reseller/availability/AvailabilityCheckStep';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';

@singleton()
export class AvailabilityFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(AvailabilityCalendarStep) private readonly availabilityCalendarStep: AvailabilityCalendarStep,
    @inject(AvailabilityCheckStep) private readonly availabilityCheckStep: AvailabilityCheckStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
  ) {}

  public async getAvailabilityCalendar(availabilityCalendarData: any): Promise<AvailabilityCalendar[]> {
    await this.sessionStepValidationProcessor.process(this.availabilityCalendarStep, availabilityCalendarData);
    return await this.backend.getAvailabilityCalendar(availabilityCalendarData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }

  public async getAvailability(availabilityCheckData: any): Promise<Availability[]> {
    await this.sessionStepValidationProcessor.process(this.availabilityCheckStep, availabilityCheckData);
    return await this.backend.getAvailability(availabilityCheckData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }
}
