import { inject, singleton } from 'tsyringe';
import { pg as named } from 'yesql';
import { RequestLogProgress, RequestLogRepository } from './RequestLogRepository';
import { RequestLog, RequestLogRowData } from '../../types/RequestLog';
import { Database } from '../database/Database';
import { QueryUtil } from '../database/util/QueryUtil';
import { CannotCreateRequestLogError } from './error/CannotCreateRequestLogError';

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

  public async getAllForProgress(sessionId: string): Promise<RequestLogProgress[]> {
    const query =
      'SELECT DISTINCT ON (step_id) scenario_id, step_id, is_valid FROM request_log WHERE session_id = :sessionId ORDER BY step_id, created_at DESC';
    const queryResult = await this.database.getConnection().query(named(query)({ sessionId }));
    // TODO handle error

    if (queryResult.rowCount === 0) {
      return [];
    }

    return queryResult.rows.map((requestLogProgress: any) => {
      return {
        scenarioId: requestLogProgress.scenario_id,
        stepId: requestLogProgress.step_id,
        isValid: requestLogProgress.is_valid,
      } as RequestLogProgress;
    });
  }
}
