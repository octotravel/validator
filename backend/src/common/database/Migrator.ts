import { readFileSync } from 'node:fs';
import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { inject, injectable } from '@needle-di/core';
import { Logger, RuntimeError } from '@octocloud/core';
import { packageDirectory } from 'pkg-dir';
import { Database } from './Database';
import { MigrateError } from './error/MigrateError';

@injectable()
export class Migrator {
  private migrationDirectoryPath: string | undefined;

  public constructor(private readonly database = inject(Database)) {
  }

  private readonly createMigrationTable = async (): Promise<void> => {
    await this.database.getConnection().query(`
			CREATE TABLE IF NOT EXISTS migration
			(
				name VARCHAR(128) UNIQUE NOT NULL,
				applied_at TIMESTAMP NOT NULL,
				CONSTRAINT pk_name PRIMARY KEY (name)
			);
		`);
  };

  private readonly getAppliedMigrations = async (): Promise<string[]> => {
    const createResult = await this.database.getConnection().query(`
			SELECT name FROM migration
		`);

    if (createResult === null) {
      throw new RuntimeError('Failed to create migration table.');
    }

    return createResult.rows.map((row) => row.name);
  };

  private async getScannedMigrations(): Promise<string[]> {
    const scannedMigrationFileNames: string[] = await this.getAllFilesInDirectory(
      await this.getMigrationDirectoryPath(),
    );

    return scannedMigrationFileNames.map((scannedMigrationFileName) => {
      const scannedMigrationParts = scannedMigrationFileName.split('/');
      let scannedMigrationName = scannedMigrationFileName;

      if (scannedMigrationParts.length !== 0) {
        scannedMigrationName = scannedMigrationParts[scannedMigrationParts.length - 1];
      }

      return scannedMigrationName;
    });
  }

  private async getAvailableMigrations(): Promise<string[]> {
    const [scannedMigrations, appliedMigrations] = await Promise.all([
      this.getScannedMigrations(),
      this.getAppliedMigrations(),
    ]);

    return scannedMigrations.filter((migrationName) => !appliedMigrations.includes(migrationName));
  }

  /**
   * @throws MigrateError
   */
  private async applyAvailableMigrations(availableMigrations: string[], logger: Logger): Promise<void> {
    if (availableMigrations.length === 0) {
      await logger.log('No migrations to be applied were found.');
      return;
    }

    for (const availableMigration of availableMigrations) {
      const migrationSql = readFileSync(`${await this.getMigrationDirectoryPath()}/${availableMigration}`).toString();

      const migrationResult = this.database.getConnection().query(migrationSql);
      const migrationRecordResult = this.database
        .getConnection()
        .query('INSERT INTO migration (name, applied_at) VALUES($1, now())', [availableMigration]);

      await Promise.all([migrationResult, migrationRecordResult]).catch(async (reason) => {
        await this.database.getConnection().query('DELETE FROM migration WHERE name = $1;', [availableMigration]);
        throw new MigrateError(`Migration ${availableMigration} failed because an error (${reason}) occurred.`);
      });

      await logger.log(`Migration ${availableMigration} was successfully applied.`);
    }
  }

  private async getMigrationDirectoryPath(): Promise<string> {
    if (this.migrationDirectoryPath === undefined) {
      this.migrationDirectoryPath = `${await packageDirectory()}/src/common/database/migrations`;
    }

    return this.migrationDirectoryPath;
  }

  private async getAllFilesInDirectory(directoryPath: string): Promise<string[]> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const files: any = await Promise.all(
      (await readdir(directoryPath)).map(async (entity) => {
        const path = join(directoryPath, entity);
        return (await lstat(path)).isDirectory() ? await this.getAllFilesInDirectory(path) : path;
      }),
    );

    files.flat(Number.POSITIVE_INFINITY);

    return files;
  }

  /**
   * @throws MigrateError
   */
  public async migrate(logger: Logger): Promise<void> {
    await this.createMigrationTable();
    const availableMigrations = await this.getAvailableMigrations();

    await this.applyAvailableMigrations(availableMigrations, logger);
  }
}
