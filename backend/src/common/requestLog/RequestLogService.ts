import { PostgresRequestLogRepository } from './PostgresRequestLogRepository';
import { RequestLog } from '../../types/requestLog';
import { PostgresRequestLogViewRepository } from './PostgresRequestLogViewRepository';
import { inject, injectable } from 'inversify';

export interface IRequestLogService {
  logRequest(requestLog: RequestLog): Promise<void>;
  // logRequestFromContext(requestData: RequestData): Promise<void>;
  // deleteOldRequests(): Promise<void>;
  // getRequest(requestLogId: string): Promise<RequestLogDetailItem | null>;
  // getRequests(getRequestsFilter: GetRequestsFilter): Promise<RequestLogViewItem[]>;
}

@injectable()
export class RequestLogService implements IRequestLogService {
  public constructor(
    @inject(PostgresRequestLogRepository) private readonly postgresRequestLogRepository: PostgresRequestLogRepository,
    @inject(PostgresRequestLogViewRepository)
    private readonly postgresRequestLogViewRepository: PostgresRequestLogViewRepository,
  ) {}

  public async logRequest(requestLog: RequestLog): Promise<void> {
    await this.postgresRequestLogRepository.create(requestLog);
  }

  /*
  public async logRequestFromContext(requestData: RequestData): Promise<void> {
    const requestLog = await RequestLogFactory.createFromRequestData(requestData);

    await this.logRequest(requestLog);

    const subrequestLogs = await Promise.all(
      requestData.subrequests.map(async (subrequestData: SubRequestData) => {
        return await RequestLogFactory.createFromSubrequestData(subrequestData, requestData);
      }),
    );

    await Promise.all(
      subrequestLogs.map(async (subrequestLog: RequestLog) => {
        return await this.logRequest(subrequestLog);
      }),
    );
  }

  public async deleteOldRequests(): Promise<void> {
    await this.postgresRequestLogRepository.deleteOldRequests();
  }

  public async getRequest(requestLogId: string): Promise<RequestLogDetailItem | null> {
    return this.postgresRequestLogViewRepository.getOneById(requestLogId);
  }

  public async getRequests(getRequestsFilter: GetRequestsFilter): Promise<RequestLogViewItem[]> {
    const requestLogViewItems = await this.postgresRequestLogViewRepository.getAllBasedOnFilter(getRequestsFilter);

    if (requestLogViewItems.length === 0) {
      return [];
    }

    return requestLogViewItems;
  } */
}
