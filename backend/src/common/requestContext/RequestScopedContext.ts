import { v4 as uuidv4 } from 'uuid';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { RuntimeError } from '@octocloud/core';
import { ScenarioId } from '../validation/v2/scenario/ScenarioId';
import { StepId } from '../validation/v2/step/StepId';

export class RequestScopedContext {
  private readonly requestId: string;
  private sessionId: string | null = null;
  private scenarioId: ScenarioId | null = null;
  private stepId: StepId | null = null;
  private request: Request | null = null;
  private response: Response | null = null;
  private validationResult: ValidationResult | null = null;

  public constructor() {
    this.requestId = uuidv4();
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public setSessionId(sessionId: string | null): void {
    this.sessionId = sessionId;
  }

  public getSessionId(): string {
    if (this.sessionId === null) {
      throw new RuntimeError('SessionId is not set');
    }

    return this.sessionId;
  }

  public setScenarioId(scenarioId: ScenarioId | null): void {
    this.scenarioId = scenarioId;
  }

  public getScenarioId(): ScenarioId {
    if (this.scenarioId === null) {
      throw new RuntimeError('ScenarioId is not set');
    }

    return this.scenarioId;
  }

  public setStepId(stepId: StepId | null): void {
    this.stepId = stepId;
  }

  public getStepId(): StepId {
    if (this.stepId === null) {
      throw new RuntimeError('StepId is not set');
    }

    return this.stepId;
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
