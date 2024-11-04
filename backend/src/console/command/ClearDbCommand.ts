import { Command } from './Command';
import { Database } from '../../common/database/Database';
import { container } from '../../common/di/container';

export class ClearDbCommand implements Command {
  public getSlug = (): string => {
    return 'clear-db';
  };

  public run = async (): Promise<void> => {
    const database: Database = container.get(Database);

    await database.dropTables();
    await database.endPool();
  };
}
