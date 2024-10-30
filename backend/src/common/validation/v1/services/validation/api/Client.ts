import { CapabilityId } from '@octocloud/types';
import { Result } from './types';
import { Context } from '../context/Context';
import { fetchRetry, SubRequestContext } from '@octocloud/core';
import { container } from '../../../../../di/container';
import { RequestScopedContextProvider } from '../../../../../requestContext/RequestScopedContextProvider';

export interface FetchData {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: string;
  context: Context;
}
export class Client {
  private readonly requestScopedContextProvider: RequestScopedContextProvider;
  private readonly capabilities: CapabilityId[];
  private readonly headers: Record<string, string>;
  public constructor({
    capabilities,
    headers,
  }: {
    capabilities?: CapabilityId[];
    url: string;
    headers: Record<string, string>;
  }) {
    this.capabilities = capabilities ?? [];
    this.headers = headers;
    this.requestScopedContextProvider = container.resolve(RequestScopedContextProvider);
  }

  protected fetch = async <T>(data: FetchData): Promise<Result<T>> => {
    const { url, method = 'GET', body } = data;
    // eslint-disable-next-line no-console
    console.log(`${new Date().toISOString()} | ${method}: ${url}`);
    const headers = this.createHeaders();
    const init: RequestInit = {
      method,
      headers,
    };
    if (body) {
      init.body = body;
    }

    const ventrataRequestContext = this.requestScopedContextProvider
      .getRequestScopedContext()
      .getVentrataRequestContext();
    const requestId = ventrataRequestContext.getRequestId();
    const req = new Request(url, init);
    const subRequestContext = new SubRequestContext({
      request: req,
      requestId,
      accountId: '',
    });

    const res = await fetchRetry(req, undefined, { subRequestContext });
    const subRequestData = subRequestContext.getRequestData();
    ventrataRequestContext.addSubrequest(subRequestData);

    return await this.setResponse({ url, method, body: body ?? null, headers }, res);
  };

  private readonly createHeaders = (): Record<string, string> => {
    const headers = {
      'Octo-Capabilities': this.capabilities.join(', '),
      'content-type': 'application/json',
      ...this.headers,
    };

    return headers;
  };

  protected setResponse = async <T>(
    request: {
      url: string;
      method: string;
      body: string | null;
      headers: Record<string, string>;
    },
    response: Response,
  ): Promise<Result<T>> => {
    const status = response.status;
    const requestBody = this.parseBody(request.body);
    const { data, text } = await this.parseResponse<T>(response);
    const resHeaders = this.transformHeaders(response.headers);
    if (status === 200) {
      return {
        data,
        request: {
          url: request.url,
          method: request.method,
          body: requestBody,
          headers: request.headers,
        },
        response: {
          headers: resHeaders,
          status,
          body: text,
          error: null,
        },
      };
    }

    return {
      data,
      request: {
        url: request.url,
        method: request.method,
        body: requestBody,
        headers: request.headers,
      },
      response: {
        body: text,
        headers: resHeaders,
        status: response.status,
        error: {
          body: text,
          status: response.status,
        },
      },
    };
  };

  private readonly parseBody = (body: string | null): Record<string, any> | null => {
    if (body === null) {
      return null;
    }
    return JSON.parse(body);
  };

  private readonly parseResponse = async <T>(
    response: Response,
  ): Promise<{
    data: T | null;
    text: string | null;
    error: Error | null;
  }> => {
    let text = '';
    try {
      text = await response.text();
      return { data: JSON.parse(text), error: null, text };
    } catch (err) {
      return {
        data: null,
        text,
        error: new Error('invalid response format'),
      };
    }
  };

  private readonly transformHeaders = (headers: Headers): Record<string, string> => {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };
}
