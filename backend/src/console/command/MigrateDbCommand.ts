import { Database } from '../../common/database/Database';
import { Migrator } from '../../common/database/Migrator';
import { container } from '../../common/di/container';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { LoggerFactory } from '../../common/logger/LoggerFactory';
import { Command } from './Command';

export class MigrateDbCommand implements Command {
  public getSlug = (): string => {
    return 'migrate-db';
  };

  public run = async (): Promise<void> => {
    const database: Database = container.get(Database);
    const migrator: Migrator = container.get(Migrator);
    const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
    const consoleLogger = consoleLoggerFactory.create(this.getSlug());

    await migrator.migrate(consoleLogger);
    await database.endPool();
  };
}
