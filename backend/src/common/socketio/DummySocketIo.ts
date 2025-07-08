import { Session } from '../../types/Session';
import { Step } from '../validation/v2/step/Step';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { WebSocket } from './WebSocket';

export class DummySocketIo implements WebSocket {
  public async sendValidationResult(
    _session: Session,
    _step: Step,
    _validationResult: ValidationResult,
  ): Promise<void> {}
}
