import { Session } from '../../types/Session';
import { Step } from '../validation/reseller/step/Step';
import { ValidationResult } from '../validation/reseller/ValidationResult';

export interface WebSocket {
  sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void>;
}
