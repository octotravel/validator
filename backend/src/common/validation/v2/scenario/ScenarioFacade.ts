import { inject, singleton } from 'tsyringe';
import { ScenarioRepository } from './ScenarioRepository';
import { Scenario } from './Scenario';
import { CapabilityId } from '@octocloud/types';

@singleton()
export class ScenarioFacade {
  public constructor(@inject('ScenarioRepository') private readonly scenarioRepository: ScenarioRepository) {}

  public async getAllResellerScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioRepository.getAllResellerScenariosByCapabilities(capabilities);
  }

  public async getAllSupplierScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioRepository.getAllSupplierScenariosByCapabilities(capabilities);
  }
}
