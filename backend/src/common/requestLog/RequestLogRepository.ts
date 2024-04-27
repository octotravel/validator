import { RequestLog } from '../../types/RequestLog';

export interface RequestLogRepository {
  create: (requestLog: RequestLog) => Promise<void>;
}
