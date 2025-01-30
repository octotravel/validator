import { Database } from '../../common/database/Database';
import { Migrator } from '../../common/database/Migrator';
import { container } from '../../common/di/container';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { Command } from './Command';

export class MigrateDbCommand implements Command {
  public getSlug = (): string => {
    return 'migrate-db';
  };

  public run = async (): Promise<void> => {
    const database = container.get(Database);
    const migrator = container.get(Migrator);
    const consoleLoggerFactory = container.get(ConsoleLoggerFactory);
    const consoleLogger = consoleLoggerFactory.create(this.getSlug());

    await migrator.migrate(consoleLogger);
    await database.endPool();
  };
}
