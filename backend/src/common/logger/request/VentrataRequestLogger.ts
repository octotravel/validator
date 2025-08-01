import { inject } from '@needle-di/core';
import {
  BaseRequestData,
  BaseRequestMetaData,
  Environment,
  fetchRetry,
  Logger,
  RequestContext,
  RequestData,
  RequestMethod,
  SubRequestData,
  SubRequestRetryData,
} from '@octocloud/core';
import pLimit from 'p-limit';
import qs from 'query-string';
import config from '../../config/config';
import { ConsoleLoggerFactory } from '../ConsoleLoggerFactory';
import { LoggerFactory } from '../LoggerFactory';
import { RequestLogger } from './RequestLogger';

const limit = pLimit(6);

export class VentrataRequestLogger implements RequestLogger {
  private readonly consoleLogger: Logger;

  public constructor(
    // private readonly exceptionLogger: ExceptionLogger = inject<ExceptionLogger>(EXCEPTION_LOGGER),
    consoleLoggerFactory: LoggerFactory = inject(ConsoleLoggerFactory),
  ) {
    this.consoleLogger = consoleLoggerFactory.create();
  }

  public async logAll(requestData: RequestData, requestContext: RequestContext): Promise<void> {
    await this.logRequest(requestData, requestContext).catch(async (e) => {
      await this.consoleLogger.error(e);
      // this.exceptionLogger.error(e, requestContext);
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
      // this.exceptionLogger.error(e, requestContext);
    });
  }

  public async logRequest(data: RequestData, ctx: RequestContext): Promise<void> {
    const request = await this.mapRequest(data, ctx);
    const requestLog = {
      ...request,
      inbound: true,
    };
    await this.saveRequestLog(data.getMetaData().id, requestLog);
  }

  public async logSubRequest(data: SubRequestData, ctx: RequestContext): Promise<void> {
    const request = await this.mapRequest(data, ctx);
    const requestLog = {
      ...request,
      inbound: false,
      request_id: data.getMetaData().requestId,
    };
    await this.saveRequestLog(data.getMetaData().id, requestLog);
  }

  public async logSubRequestRetry(data: SubRequestRetryData, ctx: RequestContext): Promise<void> {
    const request = await this.mapRequest(data, ctx);
    const requestLog = {
      ...request,
      inbound: false,
      request_id: data.getMetaData().requestId,
    };
    await this.saveRequestLog(data.getMetaData().id, requestLog);
  }

  private async mapRequest<RequestDataType extends BaseRequestMetaData>(
    data: BaseRequestData<RequestDataType>,
    ctx: RequestContext,
  ): Promise<Record<string, unknown>> {
    const req = data.getRequest();
    const res = data.getResponse();

    const url = new URL(req.url);
    const reqBody = await this.parseBody(req);
    const resBody = await this.parseBody(res);
    const env = config.getEnvironment();

    return {
      test: env === Environment.LOCAL || env === Environment.TEST,
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
      response_code: data.getMetaData().status,
      response_headers: this.transformHeaders(res.headers),
      response_body: resBody,
      duration: data.getMetaData().duration,
      created_at: data.getMetaData().date.toISOString(),
      backend_id: ctx.getRequest().headers.get('ventrata-backend-id'),
    };
  }

  private getServiceName(ctx: RequestContext): string {
    try {
      return ctx.getChannel();
    } catch (e: unknown) {
      return 'Ventrata Backends Internal';
    }
  }

  private async saveRequestLog(id: string, data: unknown): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Ventrata-Queue-Overflow': 'true',
    };

    const request = new Request(`https://api.ventrata.com/octo/ventrata/requests/${id}`, {
      method: RequestMethod.Put,
      headers,
      body: JSON.stringify(data),
    });

    await fetchRetry(request);
  }

  private transformHeaders(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key.toLowerCase()] = value;
    });
    return obj;
  }

  private async parseBody(bodyHolder: Request | Response): Promise<string | undefined> {
    try {
      const text = await bodyHolder.text();

      try {
        const json = JSON.parse(text);
        return JSON.stringify(json);
      } catch (jsonErr) {
        return text;
      }
    } catch (textErr) {
      return undefined;
    }
  }
}
