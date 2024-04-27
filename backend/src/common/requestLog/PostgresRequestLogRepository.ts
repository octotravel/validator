import { inject, singleton } from 'tsyringe';
import { pg as named } from 'yesql';
import { RequestLogRepository } from './RequestLogRepository';
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
}
