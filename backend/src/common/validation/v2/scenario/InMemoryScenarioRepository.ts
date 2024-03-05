import { injectAll, singleton } from 'tsyringe';
import { Scenario } from './Scenario';
import { ScenarioRepository } from './ScenarioRepository';
import { ScenarioId } from './ScenarioId';

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

  public async getAllSupplierScenarios(): Promise<Scenario[]> {
    return this.supplierScenarios;
  }
}
