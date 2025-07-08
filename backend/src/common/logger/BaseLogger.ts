import { Logger, LogLevel } from '@octocloud/core';

export abstract class BaseLogger implements Logger {
  public async fatal(data: unknown, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: unknown, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: unknown, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: unknown, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: unknown, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: unknown, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  public abstract logLevel(level: LogLevel, data: unknown, context?: unknown): Promise<unknown>;
}
