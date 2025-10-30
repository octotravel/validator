import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { inject } from '@needle-di/core';
import { Environment } from '@octocloud/core';
import isDocker from 'is-docker';
import postgresql, { ClientBase, ClientConfig, Pool, PoolClient, PoolConfig, QueryResult } from 'pg';
import config from '../config/config';
import { ConsoleLogger } from '../logger/console/ConsoleLogger';
import { ExceptionLogger } from '../logger/exception/ExceptionLogger';
import { Database } from './Database';
import { PoolConnectionError } from './error/PoolConnectionError';

export class PostgresDatabase implements Database {
  public constructor(
    private readonly consoleLogger: ConsoleLogger = inject('ConsoleLogger'),
    private readonly exceptionLogger: ExceptionLogger = inject('ExceptionLogger'),
  ) {}

  private pool: Pool | null = null;

  public async initPool(): Promise<void> {
    if (this.pool !== null) {
      return;
    }

    try {
      const env = config.getEnvironment();
      const commonPoolConfig: PoolConfig = {
        database: env === Environment.TEST ? config.DB_TEST_NAME : config.DB_NAME,
        keepAlive: false,
        connectionTimeoutMillis: 2000,
        allowExitOnIdle: true,
        idleTimeoutMillis: 10000,
      };
      let poolConfig: ClientConfig;

      if (config.DB_USE_IAM_AUTH) {
        const connector = new Connector();
        const clientOpts = await connector.getOptions({
          instanceConnectionName: config.DB_INSTANCE_CONNECTION_NAME,
          ipType: IpAddressTypes.PUBLIC,
          authType: AuthTypes.IAM,
        });

        const user = config.DB_USE_MIGRATION_IAM_USER ? config.DB_IAM_MIGRATION_USER : config.DB_IAM_USER;

        poolConfig = {
          ...commonPoolConfig,
          ...clientOpts,
          user,
        };
      } else {
        poolConfig = {
          ...commonPoolConfig,
          user: config.DB_USER,
          host: (env === Environment.LOCAL || env === Environment.TEST) && !isDocker() ? 'localhost' : config.DB_HOST,
          password: config.DB_PASSWORD,
          port: config.DB_PORT,
          ssl: config.DB_USE_SSL ? { rejectUnauthorized: false } : false,
        };
      }

      const pool = new postgresql.Pool(poolConfig);
      this.pool = pool;

      if (config.DB_USE_MIGRATION_IAM_USER) {
        this.pool.on('connect', async (client: ClientBase) => {
          await client.query('SET ROLE postgres;');
        });
      }

      this.pool.on('error', async (err: Error, client: ClientBase) => {
        await this.consoleLogger.error(err);
        await this.exceptionLogger.error(err);
      });

      this.pool.on('release', async (err: Error, client: ClientBase) => {
        if (err) {
          await this.consoleLogger.error(err);
          await this.exceptionLogger.error(err);
        }
      });
    } catch (e: unknown) {
      let errorMessage = 'Unknown error';

      if (e instanceof Error) {
        errorMessage = e.message ?? '';
      }

      throw PoolConnectionError.create(`Can not connect database pool, because of error "${errorMessage}".`, e);
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
      throw PoolConnectionError.create('Can not disconnect database pool.', e);
    }
  }

  public async isReady(): Promise<boolean> {
    try {
      const client = await this.getClient();
      client.release();
      return true;
    } catch (e: unknown) {
      console.log(e);
      return false;
    }
  }

  public async getConnection(): Promise<Pool> {
    if (this.pool === null) {
      await this.initPool();
    }

    return this.pool!;
  }

  public async getClient(): Promise<PoolClient> {
    return await (await this.getConnection()).connect();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <?>
  public async query(...args: [string, ...any[]]): Promise<QueryResult<any>> {
    return await (await this.getConnection()).query(...args);
  }

  public async startTransaction(): Promise<void> {
    await this.query('BEGIN');
  }

  public async commitTransaction(): Promise<void> {
    await this.query('COMMIT');
  }

  public async rollbackTransaction(): Promise<void> {
    await this.query('ROLLBACK');
  }

  public async dropTables(): Promise<void> {
    const env = config.getEnvironment();

    if (env !== Environment.LOCAL && env !== Environment.TEST) {
      return;
    }

    await this.query(`
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
    const env = config.getEnvironment();

    if (env !== Environment.LOCAL && env !== Environment.TEST) {
      return;
    }

    await this.query(`
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
