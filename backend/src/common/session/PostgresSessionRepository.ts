import { inject, singleton } from 'tsyringe';
import { GetSessionRowData, SessionRowData } from '../../types/Session';
import { CannotCreateRowError } from '../database/error/CannotCreateRowError';
import { Database } from '../database/Database';

@singleton()
export class PostgresAccountRepository {
  public constructor(@inject(Database) private readonly database: Database) {}

  public async get(id: string): Promise<SessionRowData | null> {
    const queryResult = await this.database.getConnection().query('SELECT * FROM session WHERE id = $1', [id]);

    if (queryResult.rowCount === 0) {
      return null;
    }

    return queryResult.rows[0] as SessionRowData;
  }

  public async getAll(): Promise<GetSessionRowData[]> {
    const queryResult = await this.database.getConnection().query('SELECT * FROM session ORDER BY id DESC');

    if (queryResult.rowCount === 0) {
      return [];
    }

    return queryResult.rows as GetSessionRowData[];
  }

  public async create(sessionRowData: GetSessionRowData): Promise<void> {
    await this.database
      .getConnection()
      .query(
        `
        INSERT INTO session (
            id,
            name,
            api_key
        ) VALUES ($1, $2, $3);`,
        [sessionRowData.id, sessionRowData.name, []],
      )
      .catch((e: any) => {
        throw CannotCreateRowError.create('Session', sessionRowData, e);
      });
  }

  public async update(sessionRowData: SessionRowData): Promise<void> {
    await this.database
      .getConnection()
      .query('UPDATE account set name = $1, api_key = $2 WHERE id = $3;', [
        accountRowData.name,
        accountRowData.api_key,
        accountRowData.id,
      ])
      .catch((e) => {
        throw CannotUpdateAccountError.create(accountRowData, e);
      });
  }

  public async delete(id: string): Promise<void> {
    await this.database
      .getConnection()
      .query('DELETE FROM account WHERE id = $1;', [id])
      .catch((e) => {
        throw CannotDeleteAccountError.create(id, e);
      });
  }
}
