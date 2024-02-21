export interface ValidatedError {
  body: Record<string, unknown>;
  status: number;
}

export interface ApiParams {
  headers?: Record<string, string>;
}
export interface Result<T> {
  request: ResultRequest | null;
  response: ResultResponse | null;
  data: T | null;
}

export interface ResultRequest {
  url: string;
  method: string;
  body: Record<string, any> | null;
  headers: Record<string, string>;
}

export interface ResultResponse {
  status: number;
  body: string | null;
  error: {
    status: number;
    body: string | null;
  } | null;
  headers: Record<string, string>;
}
