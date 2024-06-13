import { inject, singleton } from 'tsyringe';
import { pg as named } from 'yesql';
import {
  RequestLogDetail,
  RequestLogLatestDetail,
  RequestLogProgress,
  RequestLogRepository,
} from './RequestLogRepository';
import { RequestLog, RequestLogRowData } from '../../types/RequestLog';
import { Database } from '../database/Database';
import { QueryUtil } from '../database/util/QueryUtil';
import { CannotCreateRequestLogError } from './error/CannotCreateRequestLogError';
import { ScenarioId } from '../validation/v2/scenario/ScenarioId';
import { CannotSelectRequestLogError } from './error/CannotSelectRequestLogError';
import { CannotUpdateRequestLogError } from './error/CannotUpdateRequestLogError';

@singleton()
export class PostgresRequestLogRepository implements RequestLogRepository {
  public constructor(@inject(Database) private readonly database: Database) {}

  public async create(requestLog: RequestLog): Promise<void> {
    const requestLogRowData: RequestLogRowData = {
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
    INSERT INTO request_log(${QueryUtil.getColumnNames(requestLogRowData)}) VALUES(${QueryUtil.getColumnBindNames(
      requestLogRowData,
    )})`;

    await this.database
      .getConnection()
      .query(named(query)(requestLogRowData))
      .catch((e: any) => {
        throw CannotCreateRequestLogError.create(requestLogRowData, e);
      });
  }

  public async markCorrectlyAnsweredQuestions(requestLogId: string): Promise<void> {
    const query = `
      UPDATE request_log
      SET
        has_correctly_answered_questions = true
      WHERE 
        id = :id
    `;

    await this.database
      .getConnection()
      .query(named(query)({ id: requestLogId }))
      .catch((e: any) => {
        throw CannotUpdateRequestLogError.create(requestLogId, [], e);
      });
  }

  public async getAllForProgress(sessionId: string): Promise<RequestLogProgress[]> {
    const query =
      'SELECT DISTINCT ON (scenario_id, step_id) scenario_id, step_id, is_valid, has_correctly_answered_questions FROM request_log WHERE session_id = :sessionId ORDER BY scenario_id, step_id, created_at DESC';
    const queryResult = await this.database
      .getConnection()
      .query(named(query)({ sessionId }))
      .catch((e: any) => {
        throw CannotSelectRequestLogError.create(query, e);
      });

    if (queryResult.rowCount === 0) {
      return [];
    }

    return queryResult.rows.map((requestLog: RequestLogRowData) => {
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
      'SELECT step_id, created_at, req_headers, req_body, validation_result, is_valid FROM request_log WHERE session_id = :sessionId AND scenario_id = :scenarioId ORDER BY created_at DESC';
    const queryResult = await this.database
      .getConnection()
      .query(named(query)({ sessionId, scenarioId }))
      .catch((e: any) => {
        throw CannotSelectRequestLogError.create(query, e);
      });

    if (queryResult.rowCount === 0) {
      return [];
    }

    return queryResult.rows.map((requestLog: RequestLogRowData) => {
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
      'SELECT DISTINCT ON (scenario_id, step_id) id, is_valid FROM request_log WHERE session_id = :sessionId AND scenario_id = :scenarioId AND step_id = :stepId ORDER BY scenario_id, step_id, created_at DESC';

    const queryResult = await this.database
      .getConnection()
      .query(named(query)({ sessionId, stepId, scenarioId }))
      .catch((e: any) => {
        throw CannotSelectRequestLogError.create(query, e);
      });

    if (queryResult.rowCount === 0) {
      return null;
    }

    const requestLogProgress = queryResult.rows[0] as RequestLogRowData;

    return {
      id: requestLogProgress.id,
      isValid: requestLogProgress.is_valid,
    };
  }
}
