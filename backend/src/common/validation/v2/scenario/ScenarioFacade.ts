import { inject } from '@needle-di/core';
import { CapabilityId } from '@octocloud/types';
import { Scenario } from './Scenario';
import { ScenarioId } from './ScenarioId';
import { ScenarioService } from './ScenarioService';

export class ScenarioFacade {
  public constructor(private readonly scenarioService = inject(ScenarioService)) {}

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
