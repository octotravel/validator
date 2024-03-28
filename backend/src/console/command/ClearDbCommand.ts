import { Command } from './Command';
import { singleton, registry } from 'tsyringe';
import { Database } from '../../common/database/Database';
import { validatorContainer } from '../../common/di/index';

@singleton()
@registry([
  { token: ClearDbCommand.name, useClass: ClearDbCommand },
  { token: 'Command', useClass: ClearDbCommand },
])
export class ClearDbCommand implements Command {
  public getSlug = (): string => {
    return 'clear-db';
  };

  public run = async (): Promise<void> => {
    const database: Database = validatorContainer.resolve(Database);

    await database.dropTables();
    await database.endPool();
  };
}
