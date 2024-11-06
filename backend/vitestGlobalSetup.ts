import 'reflect-metadata';
import { container } from './src/common/di/container';
import { LoggerFactory } from './src/common/logger/LoggerFactory';
import { Migrator } from './src/common/database/Migrator';
import { ConsoleLoggerFactory } from './src/common/logger/ConsoleLoggerFactory';

const migrator = container.get(Migrator);
const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

export async function setup(): Promise<void> {
  await migrator.migrate(consoleLogger);
}
