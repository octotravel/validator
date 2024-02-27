import { inject, singleton } from 'tsyringe';
import { Scenario } from './Scenario';
import { CapabilityId } from '@octocloud/types';
import { ScenarioService } from './ScenarioService';

@singleton()
export class ScenarioFacade {
  public constructor(@inject(ScenarioService) private readonly scenarioService: ScenarioService) {}

  public async getAllResellerScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioService.getAllResellerScenariosByCapabilities(capabilities);
  }

  public async getAllSupplierScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioService.getAllSupplierScenariosByCapabilities(capabilities);
  }
}
