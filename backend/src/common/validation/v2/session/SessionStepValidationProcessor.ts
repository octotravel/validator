import { SessionStepGuard } from './SessionStepGuard';
import { StepDataValidator } from '../step/StepDataValidator';
import { Step } from '../step/Step';
import { WebSocket } from '../../../socketio/WebSocket';
import { RequestScopedContextProvider } from '../../../requestContext/RequestScopedContextProvider';
import { inject } from '@needle-di/core';

export class SessionStepValidationProcessor {
  public constructor(
    private readonly sessionStepGuard: SessionStepGuard = inject(SessionStepGuard),
    private readonly stepDataValidator: StepDataValidator = inject(StepDataValidator),
    private readonly webSocket: WebSocket = inject<WebSocket>('WebSocket'),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
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
