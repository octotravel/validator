export type RequestMetaData = {
  id: string;
  date: Date;
  connection: any;
  action: string;
  status: number;
  success: boolean;
  duration: number;
  environment: string;
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
  public subrequests: any[] = [];
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
    subrequests: any[];
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