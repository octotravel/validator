import { RequestData } from './RequestData';
import { LoggerRepository } from './LoggerRepository';
import { Context } from '../validation/context/Context';
import { v4 as uuid } from 'uuid';

export class SupabaseLogger {
  private requestService = new LoggerRepository();

  public logRequest = async (request: any, response: any, context: Context): Promise<void> => {
    const data = await this.mapData(request, response, context);

    const req = data.request.clone();
    const res = data.response.clone();
    const subrequests = await this.mapSubrequests(data.subrequests);
    const requestData = {
      id: data.metadata.id,
      date: data.metadata.date,
      connection_id: data.metadata.connection.id,
      connection_channel: data.metadata.connection.channel,
      connection_name: data.metadata.connection.name,
      connection_backend: data.metadata.connection.backend,
      connection_endpoint: data.metadata.connection.endpoint,
      account_id: null,
      account_name: null,
      env: data.metadata.environment,
      req_body: (await this.parseBody(req)) ?? null,
      req_headers: JSON.stringify(this.transformHeaders(req.headers)),
      req_method: req.method,
      req_url: req.url,
      res_status: res.status,
      res_headers: JSON.stringify(this.transformHeaders(res.headers)),
      res_body: (await this.parseBody(res)) ?? null,
      res_duration: data.metadata.duration,
      res_error: JSON.stringify(data.error),
      success: data.metadata.success,
      status: data.metadata.status,
      action: data.metadata.action,
      search_keys: data.searchKeys,
      subrequests: JSON.stringify(subrequests),
      product_ids: data.productIds.length > 0 ? data.productIds : null,
      service: "validation"
    };
    await this.requestService.set(requestData);
  };

  private mapSubrequests = async (subrequests: any[]) => {
    const promises = subrequests.map(async (subrequest) => {
      const error = subrequest.error
        ? {
            name: subrequest.error?.name,
            stack: subrequest.error.stack,
            message: subrequest.error.message,
          }
        : null;
      return {
        request: {
          url: subrequest.request?.url,
          method: subrequest.request?.method,
          body: await this.parseBody(subrequest.request),
          headers: this.transformHeaders(subrequest.request?.headers),
        },
        response: {
          status: subrequest.response?.status,
          body: await this.parseBody(subrequest.response),
          headers: this.transformHeaders(subrequest.response?.headers),
          duration: subrequest.metadata.duration,
          error,
        },
      };
    });
    return Promise.all(promises);
  };

  private transformHeaders = (headers?: Headers): { [key: string]: string } => {
    const obj: { [key: string]: string } = {};
    if (headers) {
      headers.forEach((value, key) => {
        obj[key] = value;
      });
    }
    return obj;
  };

  private parseBody = async (req: Request | Response | null): Promise<string | undefined> => {
    if (req === null) {
      return undefined;
    }
    try {
      const cloned = req.clone();
      return await cloned.json();
    } catch (err) {
      return await req.text();
    }
  };

  private mapData = async (request: any, response: any, context: Context): Promise<RequestData> => {
    return new RequestData({
      id: context.requestId,
      request: new Request(request.href, {
        method: request.method,
        body: JSON.stringify(await request.body),
      }),
      response: new Response(JSON.stringify(response.body), {
        status: response.status,
        headers: response.headers          
      }),
      metadata: {
        id: uuid(),
        date: new Date(),
        connection: {
          id: "",
          channel: "",
          name: "",
          endpoint: "",
          backend: "",
          account: null,
          environment: "",
        },
        action: "Validation",
        status: response.status,
        success: response.status === 200,
        duration: context.getRequestDuration(),
        environment: ""
      },
      logsEnabled: true,
      subrequests: context.subrequests,
      productIds: [],
    })
  }
}
