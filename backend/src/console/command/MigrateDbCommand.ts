import { Command } from './Command';
import { singleton, registry } from 'tsyringe';
import { LoggerFactory } from '../../common/logger/LoggerFactory';
import { Database } from '../../common/database/Database';
import { Migrator } from '../../common/database/Migrator';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { validatorContainer } from '../../common/di/index';

@singleton()
@registry([
  { token: MigrateDbCommand.name, useClass: MigrateDbCommand },
  { token: 'Command', useClass: MigrateDbCommand },
])
export class MigrateDbCommand implements Command {
  public getSlug = (): string => {
    return 'migrate-db';
  };

  public run = async (): Promise<void> => {
    const database: Database = validatorContainer.resolve(Database);
    const migrator: Migrator = validatorContainer.resolve(Migrator);
    const consoleLoggerFactory: LoggerFactory = validatorContainer.resolve(ConsoleLoggerFactory);
    const consoleLogger = consoleLoggerFactory.create(this.getSlug());

    await migrator.migrate(consoleLogger);
    await database.endPool();
  };
}
