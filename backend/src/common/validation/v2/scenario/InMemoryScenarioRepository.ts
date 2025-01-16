import { inject } from '@needle-di/core';
import { RESELLER_SCENARIO } from '../../../di/container';
import { Scenario } from './Scenario';
import { ScenarioRepository } from './ScenarioRepository';

export class InMemoryScenarioRepository implements ScenarioRepository {
  private readonly scenarios: Scenario[];

  public constructor(
    private readonly resellerScenarios: Scenario[] = inject(RESELLER_SCENARIO, { multi: true }),
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
