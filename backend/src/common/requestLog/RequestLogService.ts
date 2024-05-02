import { inject, singleton } from 'tsyringe';
import { RequestLog } from '../../types/RequestLog';
import { PostgresRequestLogRepository } from './PostgresRequestLogRepository';

export interface IRequestLogService {
  logRequest(requestLog: RequestLog): Promise<void>;
}

@singleton()
export class RequestLogService implements IRequestLogService {
  public constructor(
    @inject(PostgresRequestLogRepository) private readonly postgresRequestLogRepository: PostgresRequestLogRepository,
  ) {}

  public async logRequest(requestLog: RequestLog): Promise<void> {
    await this.postgresRequestLogRepository.create(requestLog);
  }
}
