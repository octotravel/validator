import assert from 'node:assert';
import postgresql, { ClientConfig, Pool, PoolClient, PoolConfig } from 'pg';

import { inject } from '@needle-di/core';
import { Environment, Logger } from '@octocloud/core';
import isDocker from 'is-docker';
import config from '../config/config';
import { ConsoleLoggerFactory } from '../logger/ConsoleLoggerFactory';
import { ExceptionLogger } from '../logger/ExceptionLogger';
import { LoggerFactory } from '../logger/LoggerFactory';
import { PoolConnectionError } from './error/PoolConnectionError';

export class Database {
  private readonly consoleLogger: Logger;

  public constructor(
    private readonly exceptionLogger: ExceptionLogger = inject('ExceptionLogger'),
    consoleLoggerFactory: LoggerFactory = inject(ConsoleLoggerFactory),
  ) {
    this.consoleLogger = consoleLoggerFactory.create('database');
  }

  private readonly clientConfig: ClientConfig = {
    user: config.DB_USER,
    host:
      (config.getEnvironment() === Environment.LOCAL || config.getEnvironment() === Environment.TEST) && !isDocker()
        ? 'localhost'
        : config.DB_HOST,
    database: config.getEnvironment() === Environment.TEST ? config.DB_TEST_NAME : config.DB_NAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    ssl: config.DB_USE_SSL ? { rejectUnauthorized: false } : false,
    keepAlive: false,
    connectionTimeoutMillis: 2000,
  };

  private readonly poolConfig: PoolConfig = {
    ...this.clientConfig,
    allowExitOnIdle: true,
    idleTimeoutMillis: 10000,
  };

  private pool: Pool | null = null;

  public initPool(): void {
    if (this.pool !== null) {
      return;
    }

    try {
      const pool = new postgresql.Pool(this.poolConfig);
      this.pool = pool;

      this.pool.on('error', (err: Error, client: PoolClient) => {
        this.consoleLogger.error(err);
        this.exceptionLogger.error(err);
      });

      this.pool.on('release', (err: Error, client: PoolClient) => {
        if (err) {
          this.consoleLogger.error(err);
          this.exceptionLogger.error(err);
        }
      });
    } catch (e: unknown) {
      assert(e instanceof Error);
      throw PoolConnectionError.create('Can not connect database pool.', e);
    }
  }

  public async endPool(): Promise<void> {
    if (this.pool === null) {
      return;
    }

    try {
      await this.pool.end();
      this.pool = null;
    } catch (e: unknown) {
      assert(e instanceof Error);
      throw PoolConnectionError.create('Can not disconnect database pool.', e);
    }
  }

  public getConnection(): Pool {
    if (this.pool === null) {
      this.initPool();
    }

    return this.pool!;
  }

  public async getClient(): Promise<PoolClient> {
    return await this.getConnection().connect();
  }

  public async startTransaction(): Promise<void> {
    await this.getConnection().query('BEGIN');
  }

  public async commitTransaction(): Promise<void> {
    await this.getConnection().query('COMMIT');
  }

  public async rollbackTransaction(): Promise<void> {
    await this.getConnection().query('ROLLBACK');
  }

  public async dropTables(): Promise<void> {
    const env = config.NODE_ENV as Environment;

    if (env !== Environment.LOCAL && env !== Environment.TEST) {
      return;
    }

    await this.getConnection().query(`
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
        END $$;
    `);
  }

  public async truncateTables(): Promise<void> {
    const env = config.NODE_ENV as Environment;

    if (env !== Environment.LOCAL && env !== Environment.TEST) {
      return;
    }

    await this.getConnection().query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
          EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || '';
        END LOOP;
      END $$;
  `);
  }
}
