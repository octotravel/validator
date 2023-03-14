export type ConnectionMetaData = {
  id: string;
  channel: string;
  name: string;
  endpoint: string;
  backend: string;
  account: string | null;
  environment: string;
};

export type RequestMetaData = {
  id: string;
  date: Date;
  connection: ConnectionMetaData;
  action: string;
  status: number;
  success: boolean;
  duration: number;
  environment: string;
};

export type SubMetadata = {
  id: string;
  requestId: string;
  date: Date;
  url: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
};

export interface IBaseRequestData {
  id: string;
  request: Request | null;
  response: Response | null;
  metadata: any;
  logsEnabled: boolean;
  error: Error | null;
  setError(error: Error): void;
}

export abstract class BaseRequestData {
  protected getDuration = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / 1000;
  };
}

export class RequestData extends BaseRequestData implements IBaseRequestData {
  public id: string;
  public request: Request;
  public response: Response;
  public metadata: RequestMetaData;
  public error: Error | null = null;
  public searchKeys: Array<string> = [];
  public logsEnabled: boolean;
  public subrequests: SubRequestData[] = [];
  public productIds: Array<string> = [];

  constructor({
    id,
    request,
    response,
    metadata,
    logsEnabled,
    subrequests,
    productIds,
  }: {
    id: string;
    request: Request;
    response: Response;
    metadata: RequestMetaData;
    logsEnabled: boolean;
    subrequests: SubRequestData[];
    productIds: string[];
  }) {
    super();
    this.id = id;
    this.response = response;
    this.request = request;
    this.metadata = metadata;
    this.logsEnabled = logsEnabled;
    this.subrequests = subrequests;
    this.productIds = productIds;
  }

  public setSearchKeys = (searchKeys: Array<string>): void => {
    this.searchKeys = searchKeys;
  };

  public setError = (error: Error): void => {
    this.error = error;
  };
}

export class SubRequestData extends BaseRequestData implements IBaseRequestData {
  public id: string;
  public request: Request | null;
  public response: Response | null;
  public metadata: SubMetadata;
  public error: Error | null = null;
  public logsEnabled: boolean;

  constructor({
    id,
    request,
    response,
    metadata,
    logsEnabled,
  }: {
    id: string;
    request: Request | null;
    response: Response | null;
    metadata: SubMetadata;
    logsEnabled: boolean;
  }) {
    super();
    this.id = id;
    this.response = response;
    this.request = request;
    this.metadata = metadata;
    this.logsEnabled = logsEnabled;
  }

  public setError = (error: Error): void => {
    this.error = error;
  };

  public clone = (): SubRequestData => {
    return new SubRequestData({
      id: this.id,
      request: this.request?.clone() ?? null,
      response: this.response?.clone() ?? null,
      metadata: this.metadata,
      logsEnabled: this.logsEnabled,
    });
  };
}
