import { Context } from '../../validation/v1/services/validation/context/Context';
import { ScenarioResult } from '../../validation/v1/services/validation/Scenarios/Scenario';

export interface SupplierRequestLogRepository {
  logScenario(scenario: ScenarioResult, context: Context): Promise<void>;
}
