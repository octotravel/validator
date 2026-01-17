import { LogLevel, SubRequestContext } from '@octocloud/core';
import { ConsoleLogger } from './ConsoleLogger';

export class NoopConsoleLogger implements ConsoleLogger {
  public async fatal(data: Error, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: Error, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  public async logLevel(level: LogLevel, data: unknown, context?: unknown): Promise<void> {}

  public async logRequest(subRequestContext: SubRequestContext): Promise<void> {}

  public async logResponse(subRequestContext: SubRequestContext): Promise<void> {}
}
