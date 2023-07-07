import { FetchData } from "../validation/api/Client";
import { v4 as uuid } from 'uuid';

export class SubRequestMapper {
  public map = (data: FetchData, headers: Record<string, string>, response: Response, date: Date): void => {
    let requestOptions: any = {
      method: data.method,
      headers: headers,
    };
    if (data.method !== "GET") {
      requestOptions = {
        ...requestOptions,
        body: data.body,
      }
    }
    const request = new Request(data.url, requestOptions);
    const subrequest = {
      request,
      response,
      metadata: {
        id: uuid(),
        requestId: data.context.requestId,
        date: new Date(),
        url: request.url,
        method: request.method,
        status: response?.status,
        success: response.status === 200,
        duration: data.context.getDuration(date, new Date())
      }
    }
    data.context.subrequests.push(subrequest)
  }
}