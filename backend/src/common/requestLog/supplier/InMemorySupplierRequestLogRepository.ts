import { SupplierRequestLog } from '../../../types/SupplierRequestLog';
import { SupplierRequestLogRepository } from './SupplierRequestLogRepository';

export class InMemorySupplierRequestLogRepository implements SupplierRequestLogRepository {
  private logs: SupplierRequestLog[] = [];

  public async create(requestLog: SupplierRequestLog): Promise<void> {
    this.logs.push({ ...requestLog });
  }

  public async getByValidationRunId(validationRunId: string): Promise<SupplierRequestLog[]> {
    return this.logs
      .filter((log) => log.validationRunId === validationRunId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  public async getAllValidationRunIds(): Promise<string[]> {
    const uniqueIds = new Set<string>();
    this.logs.forEach((log) => uniqueIds.add(log.validationRunId));
    return Array.from(uniqueIds).sort();
  }
}
