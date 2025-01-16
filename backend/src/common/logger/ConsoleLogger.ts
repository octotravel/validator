import { parentPort } from 'node:worker_threads';
import { Environment, LogLevel, LogicError } from '@octocloud/core';
import { format } from 'date-fns';
import pino, { Logger as PinoLogger, TransportTargetOptions } from 'pino';
import { packageDirectory } from 'pkg-dir';
import config from '../config/config';
import { BaseLogger } from './BaseLogger';

export class ConsoleLogger extends BaseLogger {
  private logsDirectoryPath: string | undefined;
  private pinoLogger: PinoLogger | undefined;

  public constructor(private readonly name?: string) {
    super();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async logLevel(level: LogLevel, message: unknown, context: any = null): Promise<void> {
    if (!config.APP_ENABLE_LOGGER) {
      return;
    }

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
      const targets: TransportTargetOptions[] = [
        {
          level: 'trace',
          target: 'pino-pretty',
          options: {
            colorize: env === Environment.LOCAL,
            colorizeObjects: env === Environment.LOCAL,
          },
        },
      ];

      if (config.APP_ENABLE_FILE_LOGGER) {
        let destination = `${await this.getLogsDirectoryPath()}/`;

        if (this.name) {
          destination += `${this.name}/`;
        }

        destination += `${format(new Date(), 'yyyy-MM-dd')}.log`;

        targets.push({
          level: 'trace',
          target: 'pino-pretty',
          options: {
            destination,
            mkdir: true,
            colorize: false,
            colorizeObjects: false,
          },
        });
      }

      const transport = pino.transport({
        targets,
      });

      this.pinoLogger = pino({}, transport);
    }

    return this.pinoLogger;
  }
}
