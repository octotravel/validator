import { Session } from '../../types/Session';
import { Step } from '../validation/v2/step/Step';
import { ValidationResult } from '../validation/v2/ValidationResult';

export interface WebSocket {
  sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void>;
}
