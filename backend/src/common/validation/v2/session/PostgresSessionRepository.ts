import { inject } from '@needle-di/core';
import { CapabilityId } from '@octocloud/types';
import { pg as named } from 'yesql';
import { SessionData, SessionRowData } from '../../../../types/Session';
import { Database } from '../../../database/Database';
import { ScenarioId } from '../scenario/ScenarioId';
import { SessionRepository } from './SessionRepository';
import { CannotCreateSessionError } from './error/CannotCreateSessionError';
import { CannotDeleteSessionError } from './error/CannotDeleteSessionError';
import { CannotUpdateSessionError } from './error/CannotUpdateSessionError';

export class PostgresSessionRepository implements SessionRepository {
  public constructor(private readonly database: Database = inject('Database')) {}

  public async get(id: string): Promise<SessionData | null> {
    const queryResult = await this.database.query('SELECT * FROM session WHERE id = $1', [id]);

    if (queryResult.rowCount === 0) {
      return null;
    }

    const sessionRowData = queryResult.rows[0] as SessionRowData;
    const sessionData: SessionData = {
      id: sessionRowData.id,
      name: sessionRowData.name,
      capabilities: JSON.parse(JSON.stringify(sessionRowData.capabilities)) as CapabilityId[],
      currentScenario: sessionRowData.current_scenario as ScenarioId,
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
      created_at,
      updated_at
    ) VALUES(
      :id,
      :name,
      :capabilities,
      :current_scenario,
      :created_at,
      :updated_at
    )
    `;

    const sessionRowData: SessionRowData = {
      id: sessionData.id,
      name: sessionData.name,
      capabilities: JSON.stringify(sessionData.capabilities),
      current_scenario: sessionData.currentScenario,
      created_at: sessionData.createdAt,
      updated_at: sessionData.updatedAt,
    };

    await this.database.query(named(query)(sessionRowData)).catch((e: unknown) => {
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
      created_at = :created_at,
      updated_at = :updated_at
    WHERE 
      id = :id
    `;

    const sessionRowData: SessionRowData = {
      id: sessionData.id,
      name: sessionData.name,
      capabilities: JSON.stringify(sessionData.capabilities),
      current_scenario: sessionData.currentScenario,
      created_at: sessionData.createdAt,
      updated_at: sessionData.updatedAt,
    };

    await this.database.query(named(query)(sessionRowData)).catch((e: unknown) => {
      throw CannotUpdateSessionError.create(sessionRowData, e);
    });
  }

  public async delete(id: string): Promise<void> {
    const query = `
    DELETE FROM account WHERE id = :id;
    `;

    await this.database.query(named(query)({ id })).catch((e: unknown) => {
      throw CannotDeleteSessionError.create(id, e);
    });
  }
}
