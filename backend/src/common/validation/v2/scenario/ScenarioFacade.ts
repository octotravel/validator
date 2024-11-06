import { Scenario } from './Scenario';
import { CapabilityId } from '@octocloud/types';
import { ScenarioService } from './ScenarioService';
import { ScenarioId } from './ScenarioId';
import { inject } from '@needle-di/core';

export class ScenarioFacade {
  public constructor(private readonly scenarioService: ScenarioService = inject(ScenarioService)) {}

  public async getAllResellerScenariosAvailableForCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioService.getAllResellerScenariosAvailableForCapabilities(capabilities);
  }

  public async getAllSupplierScenariosAvailableForCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioService.getAllSupplierAvailableForCapabilities(capabilities);
  }

  public async getScenarioById(scenarioId: ScenarioId): Promise<Scenario> {
    return await this.scenarioService.getScenarioById(scenarioId);
  }
}
