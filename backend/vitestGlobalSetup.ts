import { Migrator } from './src/common/database/Migrator';
import { container } from './src/common/di/container';
import { ConsoleLogger } from './src/common/logger/console/ConsoleLogger';

const migrator = container.get(Migrator);
const consoleLogger = container.get<ConsoleLogger>('ConsoleLogger');

export async function setup(): Promise<void> {
  await migrator.migrate(consoleLogger);
}
