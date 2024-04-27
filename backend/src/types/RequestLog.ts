import { ScenarioId } from '../common/validation/v2/scenario/ScenarioId';
import { StepId } from '../common/validation/v2/step/StepId';

export interface RequestLog {
  id: string;
  sessionId: string;
  scenarioId: ScenarioId;
  stepId: StepId;
  createdAt: Date;
  reqBody: string;
  reqMethod: string;
  reqUrl: string;
  reqHeaders: string;
  resStatus: number;
  resHeaders: string;
  resBody: string;
  resDuration: number;
  validationResult: string;
  isValid: boolean;
}

export interface RequestLogRowData {
  id: string;
  session_id: string;
  scenario_id: ScenarioId;
  step_id: StepId;
  created_at: Date;
  req_body: string;
  req_method: string;
  req_url: string;
  req_headers: string;
  res_status: number;
  res_headers: string;
  res_body: string;
  res_duration: number;
  validation_result: string;
  is_valid: boolean;
}
