import { v4 as uuidv4 } from 'uuid';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { RuntimeError } from '@octocloud/core';

export class RequestScopedContext {
  private readonly requestId: string;
  private request: Request | null = null;
  private response: Response | null = null;
  private validationResult: ValidationResult | null = null;

  public constructor() {
    this.requestId = uuidv4();
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

  public getRequestId(): string {
    return this.requestId;
  }
}
