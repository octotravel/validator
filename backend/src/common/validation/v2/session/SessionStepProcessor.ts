import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepValidator } from '../step/StepValidator';
import { Step } from '../step/Step';
import { WebSocket } from '../../../socketio/WebSocket';
import { RequestScopedContextProvider } from '../../../requestContext/RequestScopedContextProvider';

@singleton()
export class SessionStepProcessor {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepValidator) private readonly stepValidator: StepValidator,
    @inject('WebSocket') private readonly webSocket: WebSocket,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
  ) {}

  public async process(step: Step, requestData: any = null): Promise<void> {
    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    const session = requestScopedContext.getSession();
    await this.sessionStepGuard.check(session, step);

    const validationResult = await this.stepValidator.validate(
      step,
      requestData,
      requestScopedContext.getRequest().headers,
    );
    requestScopedContext.setValidationResult(validationResult);
    this.webSocket.sendValidationResult(session, step, validationResult);

    if (validationResult.isValid()) {
      await this.sessionService.updateSessionStep(session.id, step.getId());
    }
  }
}
