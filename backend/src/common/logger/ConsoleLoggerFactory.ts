import { injectable } from '@needle-di/core';
import { Logger } from '@octocloud/core';
import { ConsoleLogger } from './ConsoleLogger';
import { LoggerFactory } from './LoggerFactory';

@injectable()
export class ConsoleLoggerFactory implements LoggerFactory {
  public create(name?: string): Logger {
    return new ConsoleLogger(name);
  }
}
