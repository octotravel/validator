import { inject } from '@needle-di/core';
import * as socketio from 'socket.io';
import { Session } from '../../types/Session';
import { container } from '../di/container';
import { ConsoleLogger } from '../logger/console/ConsoleLogger';
import { ScenarioId } from '../validation/reseller/scenario/ScenarioId';
import { Step } from '../validation/reseller/step/Step';
import { StepId } from '../validation/reseller/step/StepId';
import { ValidationResult } from '../validation/reseller/ValidationResult';
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

  public constructor(private readonly consoleLogger: ConsoleLogger = inject('ConsoleLogger')) {}

  public async sendValidationResult(session: Session, step: Step, validationResult: ValidationResult): Promise<void> {
    await this.consoleLogger.log(`Sending validation result to session with id "${session.id}".`);
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
