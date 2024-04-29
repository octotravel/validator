import { RequestLog } from '../../types/RequestLog';

export type RequestLogProgress = Pick<RequestLog, 'scenarioId' | 'stepId' | 'isValid'>;

export interface RequestLogRepository {
  create: (requestLog: RequestLog) => Promise<void>;
  getAllForProgress: (sessionId: string) => Promise<RequestLogProgress[]>;
}
