import { Pool, PoolClient } from 'pg';

export interface QueryResult {
  rowCount: number;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  rows: any[];
}

export interface Database {
  initPool: () => Promise<void>;

  endPool: () => Promise<void>;

  isReady: () => Promise<boolean>;

  getConnection: () => Promise<Pool>;

  getClient: () => Promise<PoolClient>;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  query: (...args: any[]) => Promise<QueryResult>;

  startTransaction: () => Promise<void>;

  commitTransaction: () => Promise<void>;

  rollbackTransaction: () => Promise<void>;

  dropTables: () => Promise<void>;

  truncateTables: () => Promise<void>;
}
