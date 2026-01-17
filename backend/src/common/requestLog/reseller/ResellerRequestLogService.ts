import { inject } from '@needle-di/core';
import { ResellerRequestLog } from '../../../types/ResellerRequestLog';
import { ResellerRequestLogRepository } from './ResellerRequestLogRepository';

export interface IRequestLogService {
  logRequest(requestLog: ResellerRequestLog): Promise<void>;
}

export class ResellerRequestLogService implements IRequestLogService {
  public constructor(
    private readonly postgresResellerRequestLogRepository: ResellerRequestLogRepository = inject(
      'ResellerRequestLogRepository',
    ),
  ) {}

  public async logRequest(requestLog: ResellerRequestLog): Promise<void> {
    await this.postgresResellerRequestLogRepository.create(requestLog);
  }
}
