import { parentPort } from 'node:worker_threads';
import { Environment, LogicError, LogLevel, SubRequestContext } from '@octocloud/core';
import pino, { LoggerOptions, Logger as PinoLogger } from 'pino';
import config from '../../config/config';
import { ConsoleLogger } from './ConsoleLogger';

export class PinoConsoleLogger implements ConsoleLogger {
  private pinoLogger: PinoLogger | undefined;

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

  // biome-ignore lint/suspicious/noExplicitAny: needed
  public async logLevel(level: LogLevel, message: unknown, context: any = null): Promise<void> {
    if (parentPort !== null) {
      parentPort.postMessage({ type: 'message', level, message, context });
    } else {
      const pinoLogger = await this.getPineLogger();

      if (level === LogLevel.FATAL) {
        pinoLogger.fatal(message, context);
      } else if (level === LogLevel.ERROR) {
        pinoLogger.error(message, context);
      } else if (level === LogLevel.WARNING) {
        pinoLogger.warn(message, context);
      } else if (level === LogLevel.LOG || level === LogLevel.INFO) {
        pinoLogger.info(message, context);
      } else if (level === LogLevel.DEBUG) {
        pinoLogger.debug(message, context);
      } else {
        throw new LogicError(`Used uknown log level "${level}".`);
      }
    }
  }

  private getPineLogger(): PinoLogger {
    if (this.pinoLogger === undefined) {
      const env = config.getEnvironment();
      let pinoOptions: LoggerOptions = {
        level: config.APP_LOG_LEVEL || 'trace',
      };

      if (env === Environment.LOCAL) {
        pinoOptions = {
          ...pinoOptions,
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              colorizeObjects: true,
            },
          },
        };
      }

      this.pinoLogger = pino(pinoOptions);
    }

    return this.pinoLogger;
  }

  public async logRequest(subRequestContext: SubRequestContext): Promise<void> {
    const env = config.getEnvironment();
    const request = subRequestContext.getRequest();

    if (env === Environment.LOCAL) {
      await this.log(`${request.method} ${request.url}`);
    } else {
      await this.log({
        requestMethod: request.method,
        requestUrl: request.url,
      });
    }
  }

  public async logResponse(subRequestContext: SubRequestContext): Promise<void> {
    const env = config.getEnvironment();
    const request = subRequestContext.getRequest();
    const response = subRequestContext.getResponse();

    if (response === null) {
      return;
    }

    if (env === Environment.LOCAL) {
      await this.log(`${request.method} ${request.url} ${response.status}`);
    } else {
      await this.log({
        requestMethod: request.method,
        requestUrl: request.url,
        responseStatus: response.status,
      });
    }
  }
}
