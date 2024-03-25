import * as socketio from 'socket.io';
import { singleton } from 'tsyringe';
import { validatorContainer } from '../di';
import { WebSocket } from './WebSocket';
import { ValidationResult } from '../validation/v2/ValidationResult';

export interface ServerToClientEvents {
  validationResult(sessionId: string, validationResult: ValidationResult): Promise<void>;
}

export interface ClientToServerEvents {
  session(sessionId: string): void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  sessionId: string;
}

export interface WebSocketValidationResult {
  isValid: boolean;
  data: Record<string, any>;
  errors: WebSocketValidationResultItem[];
  warnings: WebSocketValidationResultItem[];
}

export interface WebSocketValidationResultItem {
  message: string;
  path: string;
  data: any;
}

@singleton()
export class SocketIo implements WebSocket {
  private socketIoServer: socketio.Server | null = null;

  public async sendValidationResult(sessionId: string, validationResult: ValidationResult): Promise<void> {
    const websocketValidationResult = {
      isValid: validationResult.isValid(),
      data: validationResult.getData(),
      errors: validationResult.getErrors(),
      warnings: validationResult.getWarnings(),
    };

    this.getSocketIoServer().to(sessionId).emit('validationResult', sessionId, websocketValidationResult);
  }

  private getSocketIoServer(): socketio.Server {
    if (this.socketIoServer === null) {
      const socketIoServer: socketio.Server = validatorContainer.resolve('SocketIoServer');

      this.socketIoServer = socketIoServer;
    }

    return this.socketIoServer;
  }
}
