import { inject, singleton } from 'tsyringe';
import { pg as named } from 'yesql';
import { CannotCreateSessionError } from './error/CannotCreateSessionError';
import { SessionRepository } from './SessionRepository';
import { CapabilityId } from '@octocloud/types';
import { CannotUpdateSessionError } from './error/CannotUpdateSessionError';
import { CannotDeleteSessionError } from './error/CannotDeleteSessionError';
import { PostgresUtil } from '../../../util/PostgresUtil';
import { SessionData, SessionRowData } from '../../../../types/Session';
import { Database } from '../../../database/Database';

@singleton()
export class PostgresSessionRepository implements SessionRepository {
  public constructor(@inject(Database) private readonly database: Database) {}

  public async get(id: string): Promise<SessionData | null> {
    const queryResult = await this.database.getConnection().query('SELECT * FROM session WHERE id = $1', [id]);

    if (queryResult.rowCount === 0) {
      return null;
    }

    const sessionRowData = queryResult.rows[0] as SessionRowData;
    const sessionData: SessionData = {
      id: sessionRowData.id,
      name: sessionRowData.name,
      capabilities: PostgresUtil.convertToStringArray(JSON.stringify(sessionRowData.capabilities)) as CapabilityId[],
      currentScenario: sessionRowData.current_scenario,
      currentStep: sessionRowData.current_step,
      createdAt: sessionRowData.created_at,
      updatedAt: sessionRowData.updated_at,
    };

    return sessionData;
  }

  public async create(sessionData: SessionData): Promise<void> {
    const query = `
    INSERT INTO session(
      id,
      name,
      capabilities,
      current_scenario,
      current_step,
      created_at,
      updated_at
    ) VALUES(
      :id,
      :name,
      :capabilities,
      :current_scenario,
      :current_step,
      :created_at,
      :updated_at
    )
    `;

    const sessionRowData: SessionRowData = {
      id: sessionData.id,
      name: sessionData.name,
      capabilities: PostgresUtil.convertToPostgresArray(sessionData.capabilities),
      current_scenario: sessionData.currentScenario,
      current_step: sessionData.currentStep,
      created_at: sessionData.createdAt,
      updated_at: sessionData.updatedAt,
    };

    await this.database
      .getConnection()
      .query(named(query)(sessionRowData))
      .catch((e: any) => {
        throw CannotCreateSessionError.create(sessionRowData, e);
      });
  }

  public async update(sessionData: SessionData): Promise<void> {
    const query = `
    UPDATE session
    SET
      name = :name,
      capabilities = :capabilities,
      current_scenario = :current_scenario,
      current_step = :current_step,
      created_at = :created_at,
      updated_at = :updated_at
    WHERE 
      id = :id
    `;

    const sessionRowData: SessionRowData = {
      id: sessionData.id,
      name: sessionData.name,
      capabilities: PostgresUtil.convertToPostgresArray(sessionData.capabilities),
      current_scenario: sessionData.currentScenario,
      current_step: sessionData.currentStep,
      created_at: sessionData.createdAt,
      updated_at: sessionData.updatedAt,
    };

    await this.database
      .getConnection()
      .query(named(query)(sessionRowData))
      .catch((e: any) => {
        throw CannotUpdateSessionError.create(sessionRowData, e);
      });
  }

  public async delete(id: string): Promise<void> {
    const query = `
    DELETE FROM account WHERE id = :id;
    `;

    await this.database
      .getConnection()
      .query(named(query)({ id }))
      .catch((e: any) => {
        throw CannotDeleteSessionError.create(id, e);
      });
  }
}
