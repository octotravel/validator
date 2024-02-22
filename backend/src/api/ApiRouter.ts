import { HttpNotFound } from '@octocloud/core';
import { Router as BaseRouter, Router, RouterType } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { Context, Next } from 'koa';
import { RequestMapper } from './http/request/RequestMapper';
import { GetDocsHandler } from './v2/docs/GetDocsHandler';
import { V1Router } from './v1/V1Router';
import { V2Router } from './v2/V2Router';

@singleton()
export class ApiRouter {
  public constructor(
    @inject(V1Router) private readonly v1Router: V1Router,
    @inject(V2Router) private readonly v2Router: V2Router,
    @inject(GetDocsHandler) private readonly getDocsHandler: GetDocsHandler,
    private readonly router: RouterType,
  ) {
    this.router = BaseRouter();

    // Main
    this.router.get('/', async (request) => await this.getDocsHandler.handleRequest(request));
    this.router.all('/v1/*', this.v1Router.router.handle);
    this.router.all('/v2/*', this.v2Router.router.handle);
    this.router.all('*', () => {
      throw new HttpNotFound({
        error: 'BAD_REQUEST',
        errorMessage: 'Not Found',
      });
    });
  }

  public serve = async (ctx: Context, next: Next): Promise<void> => {
    const request = RequestMapper.mapRequest(ctx);
    let response: Response;

    try {
      const result = await this.router.handle(request);
      const payload = result === null ? '{}' : JSON.stringify(result);

      response = new Response(payload, {
        headers: { 'content-type': 'application/json' },
        status: 200,
      });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        response = new Response(JSON.stringify({ error: err.message, stack: err.stack ?? '' }), {
          headers: { 'content-type': 'application/json' },
          status: 500,
        });
      } else {
        response = new Response(
          JSON.stringify({
            error: typeof err === 'string' ? err : 'There was an un-recoverable error, please try again',
            stack: '',
          }),
          {
            headers: { 'content-type': 'application/json' },
            status: 500,
          },
        );
      }
    }

    if (response.status === 204) {
      ctx.response.body = null;
    } else {
      ctx.response.body = await response.json();
    }

    ctx.response.status = response.status;
    response.headers.forEach((value, key) => {
      ctx.set(key, value);
    });
  };
}
