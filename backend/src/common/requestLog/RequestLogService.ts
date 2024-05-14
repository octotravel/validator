import { inject, singleton } from 'tsyringe';
import { RequestLog } from '../../types/RequestLog';
import { PostgresRequestLogRepository } from './PostgresRequestLogRepository';
import { RequestLogRepository } from './RequestLogRepository';

export interface IRequestLogService {
  logRequest(requestLog: RequestLog): Promise<void>;
}

@singleton()
export class RequestLogService implements IRequestLogService {
  public constructor(
    @inject('RequestLogRepository') private readonly postgresRequestLogRepository: RequestLogRepository,
  ) {}

  public async logRequest(requestLog: RequestLog): Promise<void> {
    await this.postgresRequestLogRepository.create(requestLog);
  }
}
