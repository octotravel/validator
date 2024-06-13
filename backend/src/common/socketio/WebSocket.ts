import { Session } from '../../types/Session';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { Step } from '../validation/v2/step/Step';

export interface WebSocket {
  sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void>;
}
