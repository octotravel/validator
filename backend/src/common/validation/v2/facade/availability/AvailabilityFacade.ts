import { inject, singleton } from 'tsyringe';
import { Backend } from '@octocloud/core';
import { AvailabilityCalendar } from '@octocloud/types';
import { SessionService } from '../../session/SessionService';
import { BackendParamsUtil } from '../../../../util/BackendParamsUtil';
import { SessionStepProcessor } from '../../session/SessionStepProcessor';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';

@singleton()
export class AvailabilityFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(AvailabilityCalendarStep) private readonly availabilityCalendarStep: AvailabilityCalendarStep,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepProcessor) private readonly sessionStepProcessor: SessionStepProcessor,
  ) {}

  public async getAvailabilityCalendar(
    availabilityCalendarData: any,
    sessionId: string,
  ): Promise<AvailabilityCalendar[]> {
    const session = await this.sessionService.getSession(sessionId);
    await this.sessionStepProcessor.process(session, this.availabilityCalendarStep, availabilityCalendarData);

    return await this.backend.getAvailabilityCalendar(availabilityCalendarData, BackendParamsUtil.create());
  }
}
