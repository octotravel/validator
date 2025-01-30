import 'reflect-metadata';
import { Migrator } from './src/common/database/Migrator';
import { container } from './src/common/di/container';

import { ConsoleLoggerFactory } from './src/common/logger/ConsoleLoggerFactory';
import { LoggerFactory } from './src/common/logger/LoggerFactory';

const migrator = container.get(Migrator);
const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

export async function setup(): Promise<void> {
  await migrator.migrate(consoleLogger);
}
