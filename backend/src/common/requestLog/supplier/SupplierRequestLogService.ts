import { inject } from '@needle-di/core';
import { ScenarioResult } from '../../validation/v1/services/validation/Scenarios/Scenario';
import { Context } from '../../validation/v1/services/validation/context/Context';
import { SupplierRequestLogRepository } from './SupplierRequestLogRepository';

export interface ISupplierRequestLogService {
  logScenario(scenario: ScenarioResult, context: Context): Promise<void>;
}

export class SupplierRequestLogService implements ISupplierRequestLogService {
  public constructor(
    private readonly supplierRequestLogRepository: SupplierRequestLogRepository = inject(
      'SupplierRequestLogRepository',
    ),
  ) {}

  public async logScenario(scenario: ScenarioResult, context: Context): Promise<void> {
    await this.supplierRequestLogRepository.logScenario(scenario, context);
  }
}
