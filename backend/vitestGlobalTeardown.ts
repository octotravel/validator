import 'dotenv/config';
import { container } from './src/common/di/container';
import { Database } from './src/common/database/Database';

const database = container.resolve(Database);

export async function teardown(): Promise<void> {
  await database.dropTables();
  await database.endPool();
}
