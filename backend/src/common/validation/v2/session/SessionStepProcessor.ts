import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import { SessionStepGuard } from './SessionStepGuard';
import { StepValidator } from '../step/StepValidator';
import { Step } from '../step/Step';
import { Session } from '../../../../types/Session';
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

  public async process(session: Session, step: Step, requestData: any = null, requestHeaders: Headers): Promise<void> {
    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    requestScopedContext.setSessionId(session.id);
    requestScopedContext.setScenarioId(session.currentScenario);
    requestScopedContext.setStepId(step.getId());
    await this.sessionStepGuard.check(session, step);

    const validationResult = await this.stepValidator.validate(step, requestData, requestHeaders);
    requestScopedContext.setValidationResult(validationResult);
    this.webSocket.sendValidationResult(session, step, validationResult);

    if (validationResult.isValid()) {
      await this.sessionService.updateSession({
        id: session.id,
        currentStep: step.getId(),
      });
    }
  }
}
