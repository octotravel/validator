// import { RequestData, SubRequestData } from '@octocloud/core';
// import { RequestLog } from '../../types/requestLog';

/*
export class RequestLogFactory {
  public static async createFromRequestData(requestData: RequestData): Promise<RequestLog> {
    const request = requestData.request.clone();
    const response = requestData.response.clone();

    return {
      id: requestData.metadata.id,
      parent_id: null,
      service_id: Service.OCTOCLOUD,
      account_id: requestData.metadata.connection.account,
      connection_id: requestData.metadata.connection.id,
      created_at: requestData.metadata.date,
      env: requestData.metadata.environment,
      action: requestData.metadata.action,
      success: requestData.metadata.success,
      status: requestData.metadata.status,
      req_body: JSON.stringify(await this.parseBody(request)) ?? null,
      req_method: request.method,
      req_url: request.url,
      req_headers: JSON.stringify(this.transformHeaders(request.headers)),
      res_status: response.status,
      res_headers: JSON.stringify(this.transformHeaders(response.headers)),
      res_body: JSON.stringify(await this.parseBody(response)) ?? null,
      res_duration: Math.floor(requestData.metadata.duration * 1000),
      res_error: JSON.stringify(requestData.error),
      product_ids: requestData.productIds.length > 0 ? requestData.productIds : null,
    };
  }

  public static async createFromSubrequestData(
    subrequestData: SubRequestData,
    requestData: RequestData,
  ): Promise<RequestLog> {
    const request = subrequestData.request.clone();
    const response = subrequestData.response.clone();

    return {
      id: subrequestData.metadata.id,
      service_id: Service.OCTOCLOUD,
      account_id: null,
      connection_id: null,
      created_at: subrequestData.metadata.date,
      env: requestData.metadata.environment,
      action: null,
      success: subrequestData.metadata.success,
      status: subrequestData.metadata.status,
      req_body: JSON.stringify(await this.parseBody(request)) ?? null,
      req_method: request.method,
      req_url: request.url,
      req_headers: JSON.stringify(this.transformHeaders(request.headers)),
      res_status: response.status,
      res_headers: JSON.stringify(this.transformHeaders(response.headers)),
      res_body: JSON.stringify(await this.parseBody(response)) ?? null,
      res_duration: Math.floor(subrequestData.metadata.duration * 1000),
      res_error: JSON.stringify(subrequestData.error),
      product_ids: null,
    };
  }

  private static transformHeaders(headers: Headers): { [key: string]: string } {
    const obj: { [key: string]: string } = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  private static async parseBody(req: Request | Response | null): Promise<string | undefined> {
    if (req === null) {
      return undefined;
    }

    try {
      const cloned = req.clone();
      return await cloned.json();
    } catch (err) {
      return await req.text();
    }
  }
} */
