import { Database } from './src/common/database/Database';
import { container } from './src/common/di/container';

const database = container.get(Database);

export async function teardown(): Promise<void> {
  await database.dropTables();
  await database.endPool();
}
