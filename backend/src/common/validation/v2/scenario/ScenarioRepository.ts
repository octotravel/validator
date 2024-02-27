import { CapabilityId } from '@octocloud/types';
import { Scenario } from './Scenario';

export interface ScenarioRepository {
  getAllScenarios(): Promise<Scenario[]>;
  getAllResellerScenarios(): Promise<Scenario[]>;
  getAllResellerScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]>;
  getAllSupplierScenarios(): Promise<Scenario[]>;
  getAllSupplierScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]>;
}
