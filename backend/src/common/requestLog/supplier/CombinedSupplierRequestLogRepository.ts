import { Context } from '../../validation/supplier/services/validation/context/Context';
import { ScenarioResult } from '../../validation/supplier/services/validation/Scenarios/Scenario';
import { InMemorySupplierRequestLogRepository } from './InMemorySupplierRequestLogRepository';
import { PostgresSupplierRequestLogRepository } from './PostgresSupplierRequestLogRepository';
import { SupplierRequestLogRepository } from './SupplierRequestLogRepository';

export class CombinedSupplierRequestLogRepository implements SupplierRequestLogRepository {
  public constructor(
    private readonly memoryRepo: InMemorySupplierRequestLogRepository,
    private readonly postgresRepo: PostgresSupplierRequestLogRepository,
  ) {}

  public async logScenario(scenario: ScenarioResult, context: Context) {
    await Promise.all([
      this.memoryRepo.logScenario(scenario, context),
      this.postgresRepo.logScenario(scenario, context),
    ]);
  }
}
