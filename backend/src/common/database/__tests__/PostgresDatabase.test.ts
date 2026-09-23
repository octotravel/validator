import { PoolConfig } from 'pg';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsoleLogger } from '../../logger/console/ConsoleLogger';
import { ExceptionLogger } from '../../logger/exception/ExceptionLogger';
import { PostgresDatabase } from '../PostgresDatabase';

const poolOptions: PoolConfig[] = [];

vi.mock('pg', () => ({
  default: {
    Pool: class {
      public constructor(options: PoolConfig) {
        poolOptions.push(options);
      }

      public on(): void {}
    },
  },
}));

const logger = { log: vi.fn(), error: vi.fn() };

describe('PostgresDatabase pool config', () => {
  beforeEach(() => {
    poolOptions.length = 0;
  });

  it('gives a fresh Cloud SQL connection enough time to be established', async () => {
    const database = new PostgresDatabase(logger as unknown as ConsoleLogger, logger as unknown as ExceptionLogger);
    await database.initPool();

    expect(poolOptions).toHaveLength(1);
    expect(poolOptions[0].connectionTimeoutMillis).toBeGreaterThanOrEqual(10000);
  });

  it('keeps idle connections open long enough to survive gaps between user actions', async () => {
    const database = new PostgresDatabase(logger as unknown as ConsoleLogger, logger as unknown as ExceptionLogger);
    await database.initPool();

    expect(poolOptions[0].idleTimeoutMillis).toBeGreaterThanOrEqual(300000);
  });
});
