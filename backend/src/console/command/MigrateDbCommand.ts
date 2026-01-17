import { Database } from '../../common/database/Database';
import { Migrator } from '../../common/database/Migrator';
import { container } from '../../common/di/container';
import { ConsoleLogger } from '../../common/logger/console/ConsoleLogger';
import { Command } from './Command';

export class MigrateDbCommand implements Command {
  public getSlug = (): string => {
    return 'migrate-db';
  };

  public run = async (): Promise<void> => {
    const database: Database = container.get('Database');
    const migrator = container.get(Migrator);
    const consoleLogger = container.get<ConsoleLogger>('ConsoleLogger');

    await migrator.migrate(consoleLogger);
    await database.endPool();
  };
}
