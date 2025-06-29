export interface SupplierRequestLog {
  id: string;
  validationRunId: string;
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

export interface SupplierScenarioLogRawData {
  id: string;
  validation_run_id: string | null;
  created_at: string;
  req_body: string | null;
  req_method: string | null;
  req_url: string | null;
  req_headers: string | null;
  res_status: number | null;
  res_headers: string | null;
  res_body: string | null;
  res_duration: number;
  validation_result: string;
  is_valid: boolean;
  scenario_name?: string;
}
