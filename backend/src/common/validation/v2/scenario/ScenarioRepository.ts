import { Scenario } from './Scenario';

export interface ScenarioRepository {
  getAllScenarios(): Promise<Scenario[]>;
  getAllResellerScenarios(): Promise<Scenario[]>;
  getAllSupplierScenarios(): Promise<Scenario[]>;
}
