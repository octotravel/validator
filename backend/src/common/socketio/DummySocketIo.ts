import { WebSocket } from './WebSocket';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { Session } from '../../types/Session';
import { Step } from '../validation/v2/step/Step';

export class DummySocketIo implements WebSocket {
  public async sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void> {}
}
