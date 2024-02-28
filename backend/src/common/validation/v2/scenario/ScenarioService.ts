import { CapabilityId } from '@octocloud/types';
import { Scenario } from './Scenario';
import { ScenarioRepository } from './ScenarioRepository';
import { inject, singleton } from 'tsyringe';
import { ScenarioId } from '../types/ScenarioId';

@singleton()
export class ScenarioService {
  public constructor(@inject('ScenarioRepository') private readonly scenarioRepository: ScenarioRepository) {}

  public async getAllResellerScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.getAllScenariosByCapabilities(
      await this.scenarioRepository.getAllResellerScenarios(),
      capabilities,
    );
  }

  public async getAllSupplierScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.getAllScenariosByCapabilities(
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

  private async getAllScenariosByCapabilities(
    scenarios: Scenario[],
    capabilities: CapabilityId[],
  ): Promise<Scenario[]> {
    const scenarioWithCapability: Scenario[] = [];

    for (const scenario of scenarios) {
      if (
        capabilities.length === 0 ||
        scenario.getRequiredCapabilities().length === 0 ||
        scenario.getCapabilities().length === 0 ||
        scenario.getCapabilities().some((capability) => capabilities.includes(capability))
      ) {
        console.log('yas');
        scenarioWithCapability.push(scenario);
      }
    }

    return scenarioWithCapability;
  }
}
