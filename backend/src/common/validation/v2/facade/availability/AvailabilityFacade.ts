import { inject } from '@needle-di/core';
import { Backend } from '@octocloud/core';
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
} from '@octocloud/types';
import { RequestScopedContextProvider } from '../../../../requestContext/RequestScopedContextProvider';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../../step/reseller/availability/AvailabilityCheckStep';

export class AvailabilityFacade {
  public constructor(
    private readonly backend: Backend = inject<Backend>('Backend'),
    private readonly availabilityCalendarStep: AvailabilityCalendarStep = inject(AvailabilityCalendarStep),
    private readonly availabilityCheckStep: AvailabilityCheckStep = inject(AvailabilityCheckStep),
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor = inject(
      SessionStepValidationProcessor,
    ),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
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
