export interface SupplierScenarioLogData {
  id: string;
  validationRunId: string;
  createdAt: string;
  reqBody: string | null;
  reqMethod: string | null;
  reqUrl: string | null;
  reqHeaders: string | null;
  resStatus: number | null;
  resHeaders: string | null;
  resBody: string | null;
  resDuration: number;
  validationResult: string;
  isValid: boolean;
}

export interface SupplierScenarioLogRawData {
  id: string;
  validation_run_id: string;
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
}
