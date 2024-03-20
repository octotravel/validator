import { ValidationResult } from '../validation/v2/ValidationResult';

export interface WebSocket {
  sendValidationResult(sessionId: string, validationResult: ValidationResult): Promise<void>;
}
