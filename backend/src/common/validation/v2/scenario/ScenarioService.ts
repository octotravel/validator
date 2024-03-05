import { CapabilityId } from '@octocloud/types';
import { Scenario } from './Scenario';
import { ScenarioRepository } from './ScenarioRepository';
import { inject, singleton } from 'tsyringe';
import { ScenarioId } from './ScenarioId';

@singleton()
export class ScenarioService {
  public constructor(@inject('ScenarioRepository') private readonly scenarioRepository: ScenarioRepository) {}

  public async getAllResellerScenariosAvailableForCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.getAllScenariosAvailableForCapabilities(
      await this.scenarioRepository.getAllResellerScenarios(),
      capabilities,
    );
  }

  public async getAllSupplierAvailableForCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.getAllScenariosAvailableForCapabilities(
      await this.scenarioRepository.getAllSupplierScenarios(),
      capabilities,
    );
  }

  public async getResellerScenarioById(scenarioId: string): Promise<Scenario> {
    const resellerScenarios = await this.scenarioRepository.getAllResellerScenarios();

    const resellerScenarioWithId = resellerScenarios.find((scenario) => scenario.getId() === scenarioId) ?? null;

    if (resellerScenarioWithId === null) {
      // TODO proper error
      throw new Error('Scenario not found');
    }

    return resellerScenarioWithId;
  }

  public async getScenarioById(scenarioId: ScenarioId): Promise<Scenario> {
    const scenarios = await this.scenarioRepository.getAllScenarios();

    const scenarioWithId = scenarios.find((scenario) => scenario.getId() === scenarioId) ?? null;

    if (scenarioWithId === null) {
      // TODO proper error
      throw new Error('Scenario not found');
    }

    return scenarioWithId;
  }

  private async getAllScenariosAvailableForCapabilities(
    scenarios: Scenario[],
    capabilities: CapabilityId[],
  ): Promise<Scenario[]> {
    if (capabilities.length === 0) {
      return scenarios;
    }

    const availableScenarios: Scenario[] = [];

    for (const scenario of scenarios) {
      const scenarioRequiredCapabilities = scenario.getRequiredCapabilities();

      if (
        scenarioRequiredCapabilities.length !== 0 &&
        !scenarioRequiredCapabilities.every((requiredCapability) => capabilities.includes(requiredCapability))
      ) {
        continue;
      }

      availableScenarios.push(scenario);
    }

    return availableScenarios;
  }
}
