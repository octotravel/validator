import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepValidator } from '../step/StepValidator';
import { Step } from '../step/Step';
import { Session } from '../../../../types/Session';
import { WebSocket } from '../../../socketio/WebSocket';

@singleton()
export class SessionStepProcessor {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepValidator) private readonly stepValidator: StepValidator,
    @inject('WebSocket') private readonly webSocket: WebSocket,
  ) {}

  public async process(session: Session, step: Step, requestData: any = null, requestHeaders: Headers): Promise<void> {
    await this.sessionStepGuard.check(session, step);

    const validationResult = await this.stepValidator.validate(step, requestData, requestHeaders);
    this.webSocket.sendValidationResult(session, step, validationResult);

    if (validationResult.isValid()) {
      await this.sessionService.updateSession({
        id: session.id,
        currentStep: step.getId(),
      });
    }
  }
}
