import { Session } from '../../types/Session';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { Step } from '../validation/v2/step/Step';
import { WebSocket } from './WebSocket';

export class DummySocketIo implements WebSocket {
  public async sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void> {}
}
