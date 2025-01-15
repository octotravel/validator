import { inject } from '@needle-di/core';
import { RequestScopedContextProvider } from '../../../requestContext/RequestScopedContextProvider';
import { WebSocket } from '../../../socketio/WebSocket';
import { Step } from '../step/Step';
import { StepDataValidator } from '../step/StepDataValidator';
import { SessionStepGuard } from './SessionStepGuard';

export class SessionStepValidationProcessor {
  public constructor(
    private readonly sessionStepGuard: SessionStepGuard = inject(SessionStepGuard),
    private readonly stepDataValidator: StepDataValidator = inject(StepDataValidator),
    private readonly webSocket: WebSocket = inject<WebSocket>('WebSocket'),
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async process(step: Step, requestData: unknown = null): Promise<void> {
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
