import { parentPort } from 'worker_threads';
import pino, { Logger as PinoLogger } from 'pino';
import { Environment, LogLevel, LogicError } from '@octocloud/core';
import { packageDirectory } from 'pkg-dir';
import { format } from 'date-fns';
import { BaseLogger } from './BaseLogger';
import config from '../config/config';

export class ConsoleLogger extends BaseLogger {
  private logsDirectoryPath: string | undefined;
  private pinoLogger: PinoLogger | undefined;

  public constructor(private readonly name?: string) {
    super();
  }

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

  private async getLogsDirectoryPath(): Promise<string> {
    if (this.logsDirectoryPath === undefined) {
      this.logsDirectoryPath = `${await packageDirectory()}/logs`;
    }

    return this.logsDirectoryPath;
  }

  private async getPineLogger(): Promise<PinoLogger> {
    if (this.pinoLogger === undefined) {
      const env = config.NODE_ENV;
      let destination = `${await this.getLogsDirectoryPath()}/`;

      if (this.name) {
        destination += `${this.name}/`;
      }

      destination += `${format(new Date(), 'yyyy-MM-dd')}.log`;

      const transport = pino.transport({
        targets: [
          {
            level: 'trace',
            target: 'pino-pretty',
            options: {
              destination,
              mkdir: true,
              colorize: false,
              colorizeObjects: false,
            },
          },
          {
            level: 'trace',
            target: 'pino-pretty',
            options: {
              colorize: env === Environment.LOCAL,
              colorizeObjects: env === Environment.LOCAL,
            },
          },
        ],
      });

      this.pinoLogger = pino({}, transport);
    }

    return this.pinoLogger;
  }
}
