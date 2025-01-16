import { inject, injectable } from '@needle-di/core';
import { Backend } from '@octocloud/core';
import { Availability, AvailabilityCalendar } from '@octocloud/types';
import { OCTO_BACKEND } from '../../../../di/container';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../../step/reseller/availability/AvailabilityCheckStep';

@injectable()
export class AvailabilityFacade {
  public constructor(
    private readonly backend = inject<Backend>(OCTO_BACKEND),
    private readonly availabilityCalendarStep = inject(AvailabilityCalendarStep),
    private readonly availabilityCheckStep = inject(AvailabilityCheckStep),
    private readonly sessionStepValidationProcessor = inject(SessionStepValidationProcessor),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async getAvailabilityCalendar(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    availabilityCalendarData: any,
  ): Promise<AvailabilityCalendar[]> {
    await this.sessionStepValidationProcessor.process(this.availabilityCalendarStep, availabilityCalendarData);
    return await this.backend.getAvailabilityCalendar(availabilityCalendarData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async getAvailability(availabilityCheckData: any): Promise<Availability[]> {
    await this.sessionStepValidationProcessor.process(this.availabilityCheckStep, availabilityCheckData);
    return await this.backend.getAvailability(availabilityCheckData, {
      ctx: this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    });
  }
}
