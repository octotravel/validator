import { Scenario } from './Scenario';
import { ScenarioRepository } from './ScenarioRepository';
import { inject } from '@needle-di/core';

export class InMemoryScenarioRepository implements ScenarioRepository {
  private readonly scenarios: Scenario[];

  public constructor(
    private readonly resellerScenarios: Scenario[] = inject('ResellerScenario', { multi: true }),
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
