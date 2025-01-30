import * as socketio from 'socket.io';

import { inject } from '@needle-di/core';
import { Logger } from '@octocloud/core';
import { Session } from '../../types/Session';
import { container } from '../di/container';
import { ConsoleLoggerFactory } from '../logger/ConsoleLoggerFactory';
import { LoggerFactory } from '../logger/LoggerFactory';
import { ValidationResult } from '../validation/v2/ValidationResult';
import { ScenarioId } from '../validation/v2/scenario/ScenarioId';
import { Step } from '../validation/v2/step/Step';
import { StepId } from '../validation/v2/step/StepId';
import { WebSocket } from './WebSocket';

export interface ServerToClientEvents {
  validationResult(validationResult: ValidationResult): Promise<void>;
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
  scenarioId: ScenarioId;
  stepId: StepId;
  data: Record<string, unknown>;
  errors: WebSocketValidationResultItem[];
  warnings: WebSocketValidationResultItem[];
}

export interface WebSocketValidationResultItem {
  message: string;
  path: string;
  data: unknown;
}

export class SocketIo implements WebSocket {
  private socketIoServer: socketio.Server | null = null;
  private readonly consoleLogger: Logger;

  public constructor(consoleLoggerFactory: LoggerFactory = inject(ConsoleLoggerFactory)) {
    this.consoleLogger = consoleLoggerFactory.create('database');
  }

  public async sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void> {
    this.consoleLogger.log(`Sending validation result to session with id "${session.id}".`);

    const websocketValidationResult = {
      isValid: validationResult.isValid(),
      scenarioId: session.currentScenario,
      stepId: step.getId(),
      data: validationResult.getData(),
      errors: validationResult.getErrors(),
      warnings: validationResult.getWarnings(),
    };

    this.getSocketIoServer().to(session.id).emit('validationResult', websocketValidationResult);
  }

  private getSocketIoServer(): socketio.Server {
    if (this.socketIoServer === null) {
      const socketIoServer: socketio.Server = container.get('SocketIoServer');

      this.socketIoServer = socketIoServer;
    }

    return this.socketIoServer;
  }
}
