import { Logger } from '@octocloud/core';
import { ConsoleLogger } from './ConsoleLogger';
import { LoggerFactory } from './LoggerFactory';

export class ConsoleLoggerFactory implements LoggerFactory {
  public create(name?: string): Logger {
    return new ConsoleLogger(name);
  }
}
