export type JsonKey = string | number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonValue = any
export type Json = JsonValue | Record<JsonKey, JsonValue>
type Nullable<T> = T | null;


export interface ScenarioResult {
  name: string;
  success: boolean;
  validationResult: ValidationResult;
  request: Nullable<ScenarioRequest>;
  response: Nullable<ScenarioResponse>;
  errors: any[]; // validation errors
  description: string;
}

export enum ValidationResult {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  FAILED = 'FAILED',
}

export interface ScenarioRequest {
  url: string;
  method: string;
  body: Nullable<any>;
  headers: Record<string, string>;
}

export interface ScenarioResponse {
  body: Nullable<string>;
  status: Nullable<number>;
  error: Nullable<{
    body: any;
  }>;
  headers: Record<string, string>;
}

export interface FlowResult {
  name: string;
  success: boolean;
  validationResult: ValidationResult;
  totalScenarios: number;
  succesScenarios: number;
  scenarios: ScenarioResult[];
  docs: string;
}

export type ValidationContextData = {
  flows: FlowResult[]
  isLoading: boolean
  error: string | null
  fetchFlows: (data: PostData) => void
  resetError: () => void
}

export type PostData = {
  endpoint: string;
  apiKey: string;
}
