import Koa from 'koa';
import { singleton } from 'tsyringe';

@singleton()
export class RequestMapper {
  public mapRequest = (ctx: Koa.Context): Request => {
    let body: string | null = null;

    if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
      body = JSON.stringify(ctx.request.body);
    }

    return new Request(ctx.URL, {
      method: ctx.method,
      body,
      headers: ctx.headers as any,
    });
  };
}
