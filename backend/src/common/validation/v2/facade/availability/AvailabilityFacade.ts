import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { AvailabilityCalendar } from '@octocloud/types';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepProcessor } from '../../session/SessionStepProcessor';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';

@singleton()
export class AvailabilityFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(AvailabilityCalendarStep) private readonly availabilityCalendarStep: AvailabilityCalendarStep,
    @inject(SessionStepProcessor) private readonly sessionStepProcessor: SessionStepProcessor,
  ) {}

  public async getAvailabilityCalendar(availabilityCalendarData: any): Promise<AvailabilityCalendar[]> {
    await this.sessionStepProcessor.process(this.availabilityCalendarStep, availabilityCalendarData);
    return await this.backend.getAvailabilityCalendar(availabilityCalendarData, BackendParamsUtil.create());
  }
}
