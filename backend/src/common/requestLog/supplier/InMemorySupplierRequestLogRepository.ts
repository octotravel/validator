import { SupplierScenarioLogData } from '../../../types/SupplierRequestLog';
import { ScenarioResult } from '../../validation/v1/services/validation/Scenarios/Scenario';
import { Context } from '../../validation/v1/services/validation/context/Context';
import { SupplierRequestLogRepository } from './SupplierRequestLogRepository';

export class InMemorySupplierRequestLogRepository implements SupplierRequestLogRepository {
  protected logs: SupplierScenarioLogData[] = [];

  public async logScenario(scenario: ScenarioResult, context: Context): Promise<void> {
    const log: SupplierScenarioLogData = {
      id: context.requestId,
      validationRunId: context.getValidationRunId(),
      createdAt: new Date().toISOString(),
      reqBody: scenario.request?.body ? JSON.stringify(scenario.request.body) : null,
      reqMethod: scenario.request?.method || null,
      reqUrl: scenario.request?.url || null,
      reqHeaders: scenario.request?.headers ? JSON.stringify(scenario.request.headers) : null,
      resStatus: scenario.response?.status || null,
      resHeaders: scenario.response?.headers ? JSON.stringify(scenario.response.headers) : null,
      resBody: scenario.response?.body ? JSON.stringify(scenario.response.body) : null,
      resDuration: context.getRequestDuration(),
      validationResult: scenario.validationResult,
      isValid: scenario.success,
    };

    this.logs.push(log);
  }
}
