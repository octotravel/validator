import { CapabilityId } from "@octocloud/types";
import { Result } from "./types";

interface FetchData {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: string;
}
export class Client {
  private capabilities: CapabilityId[];
  private apiKey: string;
  constructor({
    capabilities,
    apiKey,
  }: {
    capabilities?: CapabilityId[];
    url: string;
    apiKey: string;
  }) {
    this.capabilities = capabilities ?? [];
    this.apiKey = apiKey;
  }

  protected fetch = async <T>(data: FetchData): Promise<Result<T>> => {
    const { url, method = "GET", body } = data;
    console.log(`${new Date().toISOString()} | ${method}: ${url}`);
    const headers = this.createHeaders();
    const init: RequestInit = {
      method: method,
      headers,
    };
    if (body) {
      init.body = body;
    }
    const res = await fetch(url, init);
    return this.setResponse({ url, method, body: body ?? null, headers }, res);
  };

  private createHeaders = (): Record<string, string> => {
    const headers = {
      "Octo-Capabilities": this.capabilities.join(", "),
      Authorization: `Bearer ${this.apiKey}`,
      "content-type": "application/json",
    };

    return headers;
  };

  protected setResponse = async <T>(
    request: {
      url: string;
      method: string;
      body: Nullable<string>;
      headers: Record<string, string>;
    },
    response: Response
  ): Promise<Result<T>> => {
    const status = response.status;
    const requestBody = this.parseBody(request.body);
    const { data, text } = await this.parseResponse<T>(response);
    const resHeaders = this.transformHeaders(response.headers);
    console.log(status);
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
    try {
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
    } catch (e) {
      return {
        data: null,
        request: {
          url: request.url,
          method: request.method,
          body: requestBody,
          headers: request.headers,
        },
        response: {
          headers: resHeaders,
          body: null,
          status: response.status,
          error: {
            body: response.statusText as any,
            status: response.status,
          },
        },
      };
    }
  };

  private parseBody = (
    body: Nullable<string>
  ): Nullable<Record<string, any>> => {
    if (body === null) {
      return null;
    }
    return JSON.parse(body);
  };

  private parseResponse = async <T>(
    response: Response
  ): Promise<{
    data: Nullable<T>;
    text: Nullable<string>;
    error: Nullable<Error>;
  }> => {
    let text = "";
    try {
      text = await response.text();
      return { data: JSON.parse(text), error: null, text };
    } catch (err) {
      return {
        data: text as any,
        text,
        error: new Error("invalid response format"),
      };
    }
  };

  private transformHeaders = (headers: Headers): { [key: string]: string } => {
    const obj: { [key: string]: string } = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };
}
