import 'reflect-metadata';
import { container } from './src/common/di/container';
import { LoggerFactory } from './src/common/logger/LoggerFactory';
import { Migrator } from './src/common/database/Migrator';

const migrator = container.resolve(Migrator);
const consoleLoggerFactory: LoggerFactory = container.resolve('ConsoleLoggerFactory');
const consoleLogger = consoleLoggerFactory.create();

export async function setup(): Promise<void> {
  await migrator.migrate(consoleLogger);
}
