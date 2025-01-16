import { inject, injectable } from '@needle-di/core';
import { RequestLog } from '../../types/RequestLog';
import { RequestLogRepository } from './RequestLogRepository';

export interface IRequestLogService {
  logRequest(requestLog: RequestLog): Promise<void>;
}

@injectable()
export class RequestLogService implements IRequestLogService {
  public constructor(
    private readonly postgresRequestLogRepository: RequestLogRepository = inject('RequestLogRepository'),
  ) {}

  public async logRequest(requestLog: RequestLog): Promise<void> {
    await this.postgresRequestLogRepository.create(requestLog);
  }
}
