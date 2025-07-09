import { ScenarioResult } from '../../validation/v1/services/validation/Scenarios/Scenario';
import { Context } from '../../validation/v1/services/validation/context/Context';

export interface SupplierRequestLogRepository {
  logScenario(scenario: ScenarioResult, context: Context): Promise<void>;
}
