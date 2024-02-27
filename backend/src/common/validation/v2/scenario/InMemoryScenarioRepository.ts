import { injectAll, singleton } from 'tsyringe';
import { Scenario } from './Scenario';
import { ScenarioRepository } from './ScenarioRepository';
import { CapabilityId } from '@octocloud/types';

@singleton()
export class InMemoryScenarioRepository implements ScenarioRepository {
  private readonly scenarios: Scenario[];

  public constructor(
    @injectAll('ResellerScenario') private readonly resellerScenarios: Scenario[],
    private readonly supplierScenarios: Scenario[] = [],
  ) {
    this.scenarios = resellerScenarios.concat(supplierScenarios);
  }

  public async getAllScenarios(): Promise<Scenario[]> {
    return this.scenarios;
  }

  public async getAllResellerScenarios(): Promise<Scenario[]> {
    return this.resellerScenarios;
  }

  public async getAllResellerScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.getAllScenariosByCapabilities(this.resellerScenarios, capabilities);
  }

  public async getAllSupplierScenarios(): Promise<Scenario[]> {
    return this.supplierScenarios;
  }

  public async getAllSupplierScenariosByCapabilities(capabilities: CapabilityId[]): Promise<Scenario[]> {
    return await this.getAllScenariosByCapabilities(this.supplierScenarios, capabilities);
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
        scenarioWithCapability.push(scenario);
      }
    }

    return scenarioWithCapability;
  }
}
