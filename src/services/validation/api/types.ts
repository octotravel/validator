export interface ValidatedError {
  body: Record<string, unknown>;
  status: number;
}


export type ApiParams = {
  headers?: Record<string, string>;
};
export interface Result<T> {
  request: Nullable<ResultRequest>;
  response: Nullable<ResultResponse>;
  data: Nullable<T>;
}

export type ResultRequest = {
  url: string;
  method: string;
  body: Nullable<Record<string, any>>;
  headers: Record<string, string>;
};

export type ResultResponse = {
  status: number;
  body: Nullable<string>;
  error: Nullable<{
    status: number;
    body: Nullable<string>;
  }>;
  headers: Record<string, string>;
};
