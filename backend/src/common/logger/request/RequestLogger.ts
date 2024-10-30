import { RequestContext, RequestData, SubRequestData, SubRequestRetryData } from '@octocloud/core';

export interface RequestLogger {
  logAll: (data: RequestData, ctx: RequestContext) => Promise<void>;
  logRequest: (data: RequestData, ctx: RequestContext) => Promise<void>;
  logSubRequest: (data: SubRequestData, ctx: RequestContext) => Promise<void>;
  logSubRequestRetry: (data: SubRequestRetryData, ctx: RequestContext) => Promise<void>;
}
