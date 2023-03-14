import { Result } from "../validation/api/types.ts";
import { Context } from "../validation/context/Context.ts";
import { SubRequestData } from "./RequestData.ts";
import { uuid } from " https://deno.land/x/uuid/mod.ts";

export class SubRequestMapper {
  public map = (result: Result<any>, context: Context, date: Date): void => {
    let requestOptions: any = {
      method: result.request?.method,
      headers: result.request?.headers,
    };
    if (result.request?.method !== "GET") {
      requestOptions = {
        ...requestOptions,
        body: JSON.stringify(result.request?.body),
      }
    }
    context.subrequests.push(new SubRequestData({
      id: uuid(),
      request: new Request(result.request?.url ?? "", requestOptions),
      response: new Response(result.response?.body ?? result.response?.error?.body, {
        headers: result.response?.headers,
        status: result.response?.status,
      }),
      logsEnabled: true,
      metadata: {
        id: uuid(),
        requestId: context.requestId,
        date: new Date(),
        url: result.request?.url ?? "",
        method: result.request?.method ?? "",
        status: result.response?.status ?? 0,
        success: result.response?.status === 200,
        duration: context.getDuration(date, new Date())
      }
    }))
  }
}