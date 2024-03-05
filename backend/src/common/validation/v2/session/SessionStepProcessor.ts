import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepValidator } from '../validator/StepValidator';
import { Step } from '../step/Step';
import { Session } from '../../../../types/Session';

@singleton()
export class SessionStepProcessor {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepValidator) private readonly stepValidator: StepValidator,
  ) {}

  public async process(session: Session, step: Step): Promise<void> {
    await this.sessionStepGuard.check(session, step);
    await this.sessionService.updateSession({
      id: session.id,
      currentStep: step.getId(),
    });

    const validationResult = await this.stepValidator.validate(step, {});
    // send to websocket
  }
}
