import { inject, singleton } from 'tsyringe';
import { Scenario } from './Scenario';
import { CapabilityId } from '@octocloud/types';
import { ScenarioService } from './ScenarioService';

@singleton()
export class ScenarioFacade {
  public constructor(@inject(ScenarioService) private readonly scenarioService: ScenarioService) {}

  public async getAllResellerScenariosAvailableForCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioService.getAllResellerScenariosAvailableForCapabilities(capabilities);
  }

  public async getAllSupplierScenariosAvailableForCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.scenarioService.getAllSupplierAvailableForCapabilities(capabilities);
  }
}
