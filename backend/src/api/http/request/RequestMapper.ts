import Koa from 'koa';

export class RequestMapper {
  public static mapRequest(ctx: Koa.Context): Request {
    let body: string | null = null;

    if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
      body = JSON.stringify(ctx.request.body);
    }

    return new Request(ctx.URL, {
      method: ctx.method,
      body,
      headers: ctx.headers as Record<string, string>,
    });
  }
}
