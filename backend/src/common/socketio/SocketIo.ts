import * as socketio from 'socket.io';
import { inject, singleton } from 'tsyringe';
import { validatorContainer } from '../di';
import { WebSocket } from './WebSocket';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { Logger } from '@octocloud/core';
import { ConsoleLoggerFactory } from '../logger/ConsoleLoggerFactory';
import { LoggerFactory } from '../logger/LoggerFactory';

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
  private readonly consoleLogger: Logger;

  public constructor(@inject(ConsoleLoggerFactory) consoleLoggerFactory: LoggerFactory) {
    this.consoleLogger = consoleLoggerFactory.create('database');
  }

  public async sendValidationResult(sessionId: string, validationResult: ValidationResult): Promise<void> {
    this.consoleLogger.log(`Sending validation result to session with id "${sessionId}".`);

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
