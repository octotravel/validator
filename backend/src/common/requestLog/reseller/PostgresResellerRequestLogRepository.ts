import { inject } from '@needle-di/core';
import { pg as named } from 'yesql';
import { ResellerRequestLog, ResellerRequestLogRowData } from '../../../types/ResellerRequestLog';
import { Database } from '../../database/Database';
import { QueryUtil } from '../../database/util/QueryUtil';
import { ScenarioId } from '../../validation/reseller/scenario/ScenarioId';
import { CannotCreateRequestLogError } from '../error/CannotCreateRequestLogError';
import { CannotSelectRequestLogError } from '../error/CannotSelectRequestLogError';
import { CannotUpdateRequestLogError } from '../error/CannotUpdateRequestLogError';
import {
  RequestLogDetail,
  RequestLogLatestDetail,
  RequestLogProgress,
  ResellerRequestLogRepository,
} from './ResellerRequestLogRepository';

export class PostgresResellerRequestLogRepository implements ResellerRequestLogRepository {
  public constructor(private readonly database: Database = inject('Database')) {}

  public async create(requestLog: ResellerRequestLog): Promise<void> {
    const requestLogRowData: ResellerRequestLogRowData = {
      id: requestLog.id,
      session_id: requestLog.sessionId,
      scenario_id: requestLog.scenarioId,
      step_id: requestLog.stepId,
      created_at: requestLog.createdAt,
      req_body: requestLog.reqBody,
      req_method: requestLog.reqMethod,
      req_url: requestLog.reqUrl,
      req_headers: requestLog.reqHeaders,
      res_status: requestLog.resStatus,
      res_headers: requestLog.resHeaders,
      res_body: requestLog.resBody,
      res_duration: requestLog.resDuration,
      validation_result: requestLog.validationResult,
      is_valid: requestLog.isValid,
      has_correctly_answered_questions: requestLog.hasCorrectlyAnsweredQuestions,
    };

    const query = `
    INSERT INTO reseller_request_log(${QueryUtil.getColumnNames(requestLogRowData)}) VALUES(${QueryUtil.getColumnBindNames(
      requestLogRowData,
    )})`;

    await this.database.query(named(query)(requestLogRowData)).catch((e: unknown) => {
      throw CannotCreateRequestLogError.create(requestLogRowData, e);
    });
  }

  public async markCorrectlyAnsweredQuestions(requestLogId: string): Promise<void> {
    const query = `
      UPDATE reseller_request_log
      SET
        has_correctly_answered_questions = true
      WHERE
        id = :id
    `;

    await this.database.query(named(query)({ id: requestLogId })).catch((e: unknown) => {
      throw CannotUpdateRequestLogError.create(requestLogId, [], e);
    });
  }

  public async getAllForProgress(sessionId: string): Promise<RequestLogProgress[]> {
    const query =
      'SELECT DISTINCT ON (scenario_id, step_id) scenario_id, step_id, is_valid, has_correctly_answered_questions FROM reseller_request_log WHERE session_id = :sessionId ORDER BY scenario_id, step_id, created_at DESC';
    const queryResult = await this.database.query(named(query)({ sessionId })).catch((e: unknown) => {
      throw CannotSelectRequestLogError.create(query, e);
    });

    if (queryResult.rowCount === 0) {
      return [];
    }

    return queryResult.rows.map((requestLog: ResellerRequestLogRowData) => {
      return {
        scenarioId: requestLog.scenario_id,
        stepId: requestLog.step_id,
        isValid: requestLog.is_valid,
        hasCorrectlyAnsweredQuestions: requestLog.has_correctly_answered_questions,
      } as RequestLogProgress;
    });
  }

  public async getAllForScenario(scenarioId: ScenarioId, sessionId: string): Promise<RequestLogDetail[]> {
    const query =
      'SELECT step_id, created_at, req_headers, req_body, validation_result, is_valid FROM reseller_request_log WHERE session_id = :sessionId AND scenario_id = :scenarioId ORDER BY created_at DESC';
    const queryResult = await this.database.query(named(query)({ sessionId, scenarioId })).catch((e: unknown) => {
      throw CannotSelectRequestLogError.create(query, e);
    });

    if (queryResult.rowCount === 0) {
      return [];
    }

    return queryResult.rows.map((requestLog: ResellerRequestLogRowData) => {
      return {
        stepId: requestLog.step_id,
        createdAt: requestLog.created_at,
        reqHeaders: requestLog.req_headers,
        reqBody: requestLog.req_body,
        validationResult: requestLog.validation_result,
        isValid: requestLog.is_valid,
      } as RequestLogDetail;
    });
  }

  public async getLatestForScenarioAndStep(
    scenarioId: ScenarioId,
    stepId: string,
    sessionId: string,
  ): Promise<RequestLogLatestDetail | null> {
    const query =
      'SELECT DISTINCT ON (scenario_id, step_id) id, req_body, res_body, is_valid FROM reseller_request_log WHERE session_id = :sessionId AND scenario_id = :scenarioId AND step_id = :stepId ORDER BY scenario_id, step_id, created_at DESC';

    const queryResult = await this.database
      .query(named(query)({ sessionId, stepId, scenarioId }))
      .catch((e: unknown) => {
        throw CannotSelectRequestLogError.create(query, e);
      });

    if (queryResult.rowCount === 0) {
      return null;
    }

    const requestLogProgress = queryResult.rows[0] as ResellerRequestLogRowData;

    return {
      id: requestLogProgress.id,
      reqBody: requestLogProgress.req_body,
      resBody: requestLogProgress.res_body,
      isValid: requestLogProgress.is_valid,
    };
  }
}
