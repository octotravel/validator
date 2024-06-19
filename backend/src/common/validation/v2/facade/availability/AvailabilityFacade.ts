import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { Availability, AvailabilityCalendar } from '@octocloud/types';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepValidationProcessor } from '../../session/SessionStepValidationProcessor';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../../step/reseller/availability/AvailabilityCheckStep';

@singleton()
export class AvailabilityFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(AvailabilityCalendarStep) private readonly availabilityCalendarStep: AvailabilityCalendarStep,
    @inject(AvailabilityCheckStep) private readonly availabilityCheckStep: AvailabilityCheckStep,
    @inject(SessionStepValidationProcessor)
    private readonly sessionStepValidationProcessor: SessionStepValidationProcessor,
  ) {}

  public async getAvailabilityCalendar(availabilityCalendarData: any): Promise<AvailabilityCalendar[]> {
    await this.sessionStepValidationProcessor.process(this.availabilityCalendarStep, availabilityCalendarData);
    return await this.backend.getAvailabilityCalendar(availabilityCalendarData, BackendParamsUtil.create());
  }

  public async getAvailability(availabilityCheckData: any): Promise<Availability[]> {
    await this.sessionStepValidationProcessor.process(this.availabilityCheckStep, availabilityCheckData);
    return await this.backend.getAvailability(availabilityCheckData, BackendParamsUtil.create());
  }
}
