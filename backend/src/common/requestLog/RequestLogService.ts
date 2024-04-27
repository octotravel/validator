import { RequestScopedContext } from '../requestContext/RequestScopedContext';
import { inject, singleton } from 'tsyringe';
import { RequestLog } from '../../types/RequestLog';
import { PostgresRequestLogRepository } from './PostgresRequestLogRepository';
import { RequestLogFactory } from './RequestLogFactory';

export interface IRequestLogService {
  logRequest(requestLog: RequestLog): Promise<void>;
  logRequestFromContext(requestScopedContext: RequestScopedContext): Promise<void>;
}

@singleton()
export class RequestLogService implements IRequestLogService {
  public constructor(
    @inject(PostgresRequestLogRepository) private readonly postgresRequestLogRepository: PostgresRequestLogRepository,
  ) {}

  public async logRequest(requestLog: RequestLog): Promise<void> {
    await this.postgresRequestLogRepository.create(requestLog);
  }

  public async logRequestFromContext(requestScopedContext: RequestScopedContext): Promise<void> {
    const requestLog = await RequestLogFactory.createFromContext(requestScopedContext);
    await this.logRequest(requestLog);
  }
}
