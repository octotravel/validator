import { Context } from '../../validation/supplier/services/validation/context/Context';
import { ScenarioResult } from '../../validation/supplier/services/validation/Scenarios/Scenario';

export interface SupplierRequestLogRepository {
  logScenario(scenario: ScenarioResult, context: Context): Promise<void>;
}
