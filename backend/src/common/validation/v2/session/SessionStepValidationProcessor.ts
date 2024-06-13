import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepDataValidator } from '../step/StepDataValidator';
import { Step } from '../step/Step';
import { WebSocket } from '../../../socketio/WebSocket';
import { RequestScopedContextProvider } from '../../../requestContext/RequestScopedContextProvider';

@singleton()
export class SessionStepValidationProcessor {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
    @inject(StepDataValidator) private readonly stepDataValidator: StepDataValidator,
    @inject('WebSocket') private readonly webSocket: WebSocket,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
  ) {}

  public async process(step: Step, requestData: any = null): Promise<void> {
    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    requestScopedContext.getSession();
    requestScopedContext.setStep(step);
    const session = requestScopedContext.getSession();
    await this.sessionStepGuard.check(session, step);

    const validationResult = await this.stepDataValidator.validate(
      step,
      requestData,
      requestScopedContext.getRequest().headers,
    );
    requestScopedContext.setValidationResult(validationResult);
    this.webSocket.sendValidationResult(session, step, validationResult);
  }
}
