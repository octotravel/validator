import { RequestLog } from '../../types/RequestLog';
import { ScenarioId } from '../validation/v2/scenario/ScenarioId';

export type RequestLogProgress = Pick<RequestLog, 'scenarioId' | 'stepId' | 'isValid'>;
export type RequestLogDetail = Pick<
  RequestLog,
  'stepId' | 'createdAt' | 'reqHeaders' | 'reqBody' | 'validationResult' | 'isValid'
>;

export interface RequestLogRepository {
  create: (requestLog: RequestLog) => Promise<void>;
  getAllForProgress: (sessionId: string) => Promise<RequestLogProgress[]>;
  getAllForScenario(scenarioId: ScenarioId, sessionId: string): Promise<RequestLogDetail[]>;
}
