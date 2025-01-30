import { RequestContext, RuntimeError } from '@octocloud/core';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../../types/Session';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { Step } from '../validation/v2/step/Step';

export class RequestScopedContext {
  private readonly requestId: string;
  private session: Session | null = null;
  private step: Step | null = null;
  private request: Request | null = null;
  private response: Response | null = null;
  private validationResult: ValidationResult | null = null;
  private ventrataRequestContext: RequestContext | null = null;

  public constructor() {
    this.requestId = uuidv4();
  }

  public getVentrataRequestContext(): RequestContext {
    if (this.ventrataRequestContext === null) {
      throw new RuntimeError('Octo Request Context is not set');
    }

    return this.ventrataRequestContext;
  }

  public setVentrataRequestContext(requestContext: RequestContext): void {
    this.ventrataRequestContext = requestContext;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public setSession(session: Session | null): void {
    this.session = session;
  }

  public getSession(): Session {
    if (this.session === null) {
      throw new RuntimeError('Session is not set');
    }

    return this.session;
  }

  public setStep(step: Step | null): void {
    this.step = step;
  }

  public getStep(): Step {
    if (this.step === null) {
      throw new RuntimeError('Step is not set');
    }

    return this.step;
  }

  public setRequest(request: Request): void {
    this.request = request.clone();
  }

  public getRequest(): Request {
    if (this.request === null) {
      throw new RuntimeError('Request is not set');
    }

    return this.request;
  }

  public setResponse(response: Response): void {
    this.response = response.clone();
  }

  public getResponse(): Response {
    if (this.response === null) {
      throw new RuntimeError('Request is not set');
    }

    return this.response;
  }

  public setValidationResult(validationResult: ValidationResult): void {
    this.validationResult = validationResult;
  }

  public getValidationResult(): ValidationResult {
    if (this.validationResult === null) {
      throw new RuntimeError('Validation result is not set');
    }

    return this.validationResult;
  }
}
