import { inject } from '@needle-di/core';
import { pg as named } from 'yesql';
import { SupplierScenarioLogRawData } from '../../../types/SupplierRequestLog';
import { Database } from '../../database/Database';
import { QueryUtil } from '../../database/util/QueryUtil';
import { safeJson } from '../../database/util/SafeJson';
import { Context } from '../../validation/v1/services/validation/context/Context';
import { ScenarioResult } from '../../validation/v1/services/validation/Scenarios/Scenario';
import { CannotCreateRequestLogError } from '../error/CannotCreateRequestLogError';
import { SupplierRequestLogRepository } from './SupplierRequestLogRepository';

export class PostgresSupplierRequestLogRepository implements SupplierRequestLogRepository {
  public constructor(private readonly database: Database = inject('Database')) {}

  public async logScenario(scenario: ScenarioResult, context: Context): Promise<void> {
    const requestLogRowData: SupplierScenarioLogRawData = {
      id: context.requestId,
      validation_run_id: context.getValidationRunId(),
      created_at: new Date().toISOString(),
      req_body: safeJson(scenario.request?.body),
      req_method: safeJson(scenario.request?.method),
      req_url: scenario.request?.url || null,
      req_headers: safeJson(scenario.request?.headers),
      res_status: scenario.response?.status || null,
      res_headers: safeJson(scenario.response?.headers),
      res_body: safeJson(scenario.response?.body),
      res_duration: context.getRequestDuration(),
      validation_result: scenario.validationResult,
      is_valid: scenario.success,
    };

    const query = `
      INSERT INTO supplier_request_log(${QueryUtil.getColumnNames(requestLogRowData)}) VALUES(${QueryUtil.getColumnBindNames(
        requestLogRowData,
      )})`;

    await this.database.query(named(query)(requestLogRowData)).catch((e: unknown) => {
      throw CannotCreateRequestLogError.create(requestLogRowData, e);
    });
  }
}
