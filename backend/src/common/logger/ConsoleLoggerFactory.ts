import { Logger } from '@octocloud/core';
import { LoggerFactory } from './LoggerFactory';
import { ConsoleLogger } from './ConsoleLogger';

export class ConsoleLoggerFactory implements LoggerFactory {
  public create(name?: string): Logger {
    return new ConsoleLogger(name);
  }
}
