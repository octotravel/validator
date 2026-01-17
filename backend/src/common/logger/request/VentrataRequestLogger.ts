import { inject } from '@needle-di/core';
import {
  BaseRequestData,
  BaseRequestMetaData,
  Environment,
  fetchRetry,
  HttpError,
  RequestContext,
  RequestData,
  RequestMethod,
  SubRequestData,
  SubRequestRetryData,
} from '@octocloud/core';
import pLimit from 'p-limit';
import qs from 'query-string';
import config from '../../config/config';
import { ConsoleLogger } from '../console/ConsoleLogger';
import { ExceptionLogger } from '../exception/ExceptionLogger';
import { RequestLogger } from './RequestLogger';

const limit = pLimit(6);

export interface VentrataRequestLog {
  test: boolean;
  error: boolean;
  user_agent: string | null;
  ip: string | null;
  service: string;
  action: string;
  base_url: string;
  path: string;
  query_string: string;
  body: string | undefined;
  request_method: string;
  headers: Record<string, string>;
  response_code: number;
  response_headers: Record<string, string>;
  response_body: string | undefined;
  duration: number;
  created_at: string;
  inbound?: boolean;
}

export interface VentrataSubRequestLog extends VentrataRequestLog {
  inbound: false;
  request_id: string;
}

export class VentrataRequestLogger implements RequestLogger {
  public constructor(
    private readonly consoleLogger: ConsoleLogger = inject('ConsoleLogger'),
    private readonly exceptionLogger: ExceptionLogger = inject('ExceptionLogger'),
  ) {}

  public async logAll(requestData: RequestData, requestContext: RequestContext): Promise<void> {
    await this.logRequest(requestData, requestContext).catch(async (e) => {
      await this.consoleLogger.error(e);
      await this.exceptionLogger.error(e, requestContext);
    });

    const subrequestPromises: Array<Promise<void>> = [];
    for (const subRequestData of requestData.getSubRequests()) {
      const hasParentRequestId = Boolean(subRequestData.getRequest().headers.get('ventrata-parent-request-id'));
      if (!hasParentRequestId) {
        subrequestPromises.push(
          limit(async () => {
            await this.logSubRequest(subRequestData, requestContext);
          }),
        );
      } else {
        const request = subRequestData.getRequest();
        const response = subRequestData.getResponse();

        if (!request.bodyUsed) {
          await request.text();
        }

        if (!response.bodyUsed) {
          await response.text();
        }
      }

      for (const subRequestRetryData of subRequestData.getRetries()) {
        subrequestPromises.push(
          limit(async () => {
            await this.logSubRequestRetry(subRequestRetryData, requestContext);
          }),
        );
      }
    }

    await Promise.all(subrequestPromises).catch(async (e) => {
      await this.consoleLogger.error(e);
      await this.exceptionLogger.error(e, requestContext);
    });
  }

  public async logRequest(data: RequestData, ctx: RequestContext): Promise<void> {
    const request = await this.mapRequestData(data, ctx);
    const requestLog: VentrataRequestLog = {
      ...request,
      inbound: true,
    };
    await this.saveRequestLog(data.getMetaData().id, requestLog, ctx);
  }

  public async logSubRequest(data: SubRequestData, ctx: RequestContext): Promise<void> {
    const request = await this.mapRequestData(data, ctx);
    const requestLog: VentrataSubRequestLog = {
      ...request,
      inbound: false,
      request_id: data.getMetaData().requestId,
    };
    await this.saveRequestLog(data.getMetaData().id, requestLog, ctx);
  }

  public async logSubRequestRetry(data: SubRequestRetryData, ctx: RequestContext): Promise<void> {
    const request = await this.mapRequestData(data, ctx);
    const requestLog: VentrataSubRequestLog = {
      ...request,
      inbound: false,
      request_id: data.getMetaData().requestId,
    };
    await this.saveRequestLog(data.getMetaData().id, requestLog, ctx);
  }

  private async mapRequestData<RequestDataType extends BaseRequestMetaData>(
    data: BaseRequestData<RequestDataType>,
    ctx: RequestContext,
  ): Promise<VentrataRequestLog> {
    const req = data.getRequest();
    const res = data.getResponse();
    const url = new URL(req.url);
    const reqBody = await this.parseBody(req, ctx);
    const resBody = await this.parseBody(res, ctx);
    const env = config.getEnvironment();
    const error = data.getError();
    let status = data.getMetaData().status;

    if (error instanceof HttpError && error.statusLog !== status) {
      status = error.statusLog;
    }

    return {
      test: env !== Environment.PRODUCTION,
      error: !data.getMetaData().success,
      user_agent: ctx.getRequest().headers.get('user-agent'),
      ip: ctx.getRequest().headers.get('cf-connecting-ip'),
      service: this.getServiceName(ctx),
      action: ctx.getAction(),
      base_url: url.origin,
      path: url.pathname,
      query_string: qs.stringify(qs.parse(url.search)),
      body: reqBody,
      request_method: req.method,
      headers: this.transformHeaders(req.headers),
      response_code: status,
      response_headers: this.transformHeaders(res.headers),
      response_body: resBody,
      duration: data.getMetaData().duration,
      created_at: data.getMetaData().date.toISOString(),
    };
  }

  private getServiceName(ctx: RequestContext): string {
    try {
      return ctx.getChannel();
    } catch (e: unknown) {
      return 'Ventrata Backends Internal';
    }
  }

  private async saveRequestLog(
    id: string,
    requestLogData: VentrataRequestLog | VentrataSubRequestLog,
    ctx: RequestContext,
  ): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Ventrata-Queue-Overflow': 'true',
    };

    try {
      const connection = ctx.getConnection();
      headers.Authorization = `Bearer ${connection.apiKey}`;
    } catch (e: unknown) {
      // ignore
    }

    const request = new Request(`https://api.ventrata.com/octo/ventrata/requests/${id}`, {
      method: RequestMethod.Put,
      headers,
      body: JSON.stringify(requestLogData),
    });

    const response = await fetchRetry(request);

    if (response.status !== 200 && response.status !== 204) {
      const errorMessage = `Failed to save request log from ${requestLogData.request_method} ${requestLogData.base_url} ${requestLogData.response_code}`;

      await this.consoleLogger.error(errorMessage, ctx);
      await this.exceptionLogger.error(errorMessage, ctx);
    }
  }

  private transformHeaders(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key.toLowerCase()] = value;
    });
    return obj;
  }

  private async parseBody(bodyHolder: Request | Response, ctx: RequestContext): Promise<string | undefined> {
    try {
      if (
        (bodyHolder instanceof Request && (bodyHolder.method === 'GET' || bodyHolder.method === 'HEAD')) ||
        (bodyHolder instanceof Response && bodyHolder.status === 204) ||
        (bodyHolder.headers.get('content-length') !== null && Number(bodyHolder.headers.get('content-length')) === 0)
      ) {
        return undefined;
      }

      if (bodyHolder.bodyUsed) {
        const errorMessage =
          bodyHolder instanceof Request
            ? `Skipping used request body from ${bodyHolder.method} ${bodyHolder.url}`
            : `Skipping used response body from ${bodyHolder.url} ${bodyHolder.status}`;

        await this.consoleLogger.error(errorMessage, ctx);
        // await this.exceptionLogger.error(errorMessage, ctx);

        return undefined;
      }

      const text = (await bodyHolder.text()).trim();
      const contentType = bodyHolder.headers.get('Content-Type');

      try {
        if (contentType?.includes('application/json') && text !== '') {
          const json = JSON.parse(text);
          return JSON.stringify(json);
        }
      } catch (jsonErr: unknown) {
        const errorMessage =
          bodyHolder instanceof Request
            ? `Failed to parse json request body from ${bodyHolder.method} ${bodyHolder.url}\n${jsonErr}`
            : `Failed to parse json response body from ${bodyHolder.url} ${bodyHolder.status}\n${jsonErr}`;

        await this.consoleLogger.error(errorMessage, ctx);
        await this.exceptionLogger.error(errorMessage, ctx);
      }

      return text;
    } catch (textErr: unknown) {
      const errorMessage =
        bodyHolder instanceof Request
          ? `Failed to parse text request body from ${bodyHolder.method} ${bodyHolder.url}\n${textErr}`
          : `Failed to parse text response body from ${bodyHolder.url} ${bodyHolder.status}\n${textErr}`;

      await this.consoleLogger.error(errorMessage, ctx);
      await this.exceptionLogger.error(errorMessage, ctx);

      return undefined;
    }
  }
}
