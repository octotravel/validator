import { RequestLog } from '../../types/RequestLog';
import { ScenarioId } from '../validation/v2/scenario/ScenarioId';

export type RequestLogProgress = Pick<
  RequestLog,
  'scenarioId' | 'stepId' | 'isValid' | 'hasCorrectlyAnsweredQuestions'
>;
export type RequestLogDetail = Pick<
  RequestLog,
  'stepId' | 'createdAt' | 'reqHeaders' | 'reqBody' | 'validationResult' | 'isValid'
>;

export type RequestLogLatestDetail = Pick<RequestLog, 'id' | 'isValid'>;

export interface RequestLogRepository {
  create: (requestLog: RequestLog) => Promise<void>;
  markCorrectlyAnsweredQuestions: (requestLogId: string) => Promise<void>;
  getAllForProgress: (sessionId: string) => Promise<RequestLogProgress[]>;
  getAllForScenario(scenarioId: ScenarioId, sessionId: string): Promise<RequestLogDetail[]>;
  getLatestForScenarioAndStep(
    scenarioId: ScenarioId,
    stepId: string,
    sessionId: string,
  ): Promise<RequestLogLatestDetail | null>;
}
