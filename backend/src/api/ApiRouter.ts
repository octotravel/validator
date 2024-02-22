import { HttpNotFound } from '@octocloud/core';
import { Router as BaseRouter, Router, RouterType } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { Context, Next } from 'koa';
import { RequestMapper } from './http/request/RequestMapper';
import { GetDocsHandler } from './v2/docs/GetDocsHandler';
import { CreateSessionHandler } from './v2/session/CreateSessionHandler';
import { UpdateSessionHandler } from './v2/session/UpdateSessionHandler';
import { ValidateHandler } from './v1/validate/ValidateHandler';

@singleton()
export class ApiRouter {
  public constructor(
    @inject(ValidateHandler) private readonly validateHandler: ValidateHandler,
    @inject(GetDocsHandler) private readonly getDocsHandler: GetDocsHandler,
    @inject(CreateSessionHandler) private readonly createSessionHandler: CreateSessionHandler,
    @inject(UpdateSessionHandler) private readonly updateSessionHandler: UpdateSessionHandler,
    private readonly router: RouterType,
  ) {
    this.router = BaseRouter();

    const v1Router = Router({ base: '/v1' });

    // V1 (Old validator)
    v1Router.post('/validate', async (request) => await this.validateHandler.handleRequest(request));

    const v2Router = Router({ base: '/v2' });

    // V2 (New validator)
    v2Router.get('/session/:sessionId', async (request) => await this.createSessionHandler.handleRequest(request));
    v2Router.post('/session', async (request) => await this.createSessionHandler.handleRequest(request));
    v2Router.put('/session/:sessionId', async (request) => await this.updateSessionHandler.handleRequest(request));

    // Main
    this.router.get('/', async (request) => await this.getDocsHandler.handleRequest(request));
    this.router.all('/v1/*', v1Router.handle);
    this.router.all('/v2/*', v2Router.handle);
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
