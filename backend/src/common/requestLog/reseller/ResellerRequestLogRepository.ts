import { ResellerRequestLog } from '../../../types/ResellerRequestLog';
import { ScenarioId } from '../../validation/v2/scenario/ScenarioId';

export type RequestLogProgress = Pick<
  ResellerRequestLog,
  'scenarioId' | 'stepId' | 'isValid' | 'hasCorrectlyAnsweredQuestions'
>;
export type RequestLogDetail = Pick<
  ResellerRequestLog,
  'stepId' | 'createdAt' | 'reqHeaders' | 'reqBody' | 'validationResult' | 'isValid'
>;

export type RequestLogLatestDetail = Pick<ResellerRequestLog, 'id' | 'isValid'>;

export interface ResellerRequestLogRepository {
  create: (requestLog: ResellerRequestLog) => Promise<void>;
  markCorrectlyAnsweredQuestions: (requestLogId: string) => Promise<void>;
  getAllForProgress: (sessionId: string) => Promise<RequestLogProgress[]>;
  getAllForScenario(scenarioId: ScenarioId, sessionId: string): Promise<RequestLogDetail[]>;
  getLatestForScenarioAndStep(
    scenarioId: ScenarioId,
    stepId: string,
    sessionId: string,
  ): Promise<RequestLogLatestDetail | null>;
}
