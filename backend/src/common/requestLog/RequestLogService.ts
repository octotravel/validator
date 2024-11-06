import { inject } from '@needle-di/core';
import { RequestLog } from '../../types/RequestLog';
import { RequestLogRepository } from './RequestLogRepository';

export interface IRequestLogService {
  logRequest(requestLog: RequestLog): Promise<void>;
}

export class RequestLogService implements IRequestLogService {
  public constructor(
    private readonly postgresRequestLogRepository: RequestLogRepository = inject('RequestLogRepository'),
  ) {}

  public async logRequest(requestLog: RequestLog): Promise<void> {
    await this.postgresRequestLogRepository.create(requestLog);
  }
}
