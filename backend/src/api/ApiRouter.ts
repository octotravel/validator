import { Router as BaseRouter, RouterType } from 'itty-router';
import { inject, singleton } from 'tsyringe';
import { Context, Next } from 'koa';
import { RequestMapper } from './http/request/RequestMapper';
import { GetDocsHandler } from './v2/docs/GetDocsHandler';
import { V1Router } from './v1/V1Router';
import { V2Router } from './v2/V2Router';
import { ErrorResponseFactory } from './http/error/ErrorResponseFactory';
import { RequestScopedContextProvider } from '../common/requestContext/RequestScopedContextProvider';

@singleton()
export class ApiRouter {
  public constructor(
    @inject(V1Router) private readonly v1Router: V1Router,
    @inject(V2Router) private readonly v2Router: V2Router,
    @inject(GetDocsHandler) private readonly getDocsHandler: GetDocsHandler,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(RequestScopedContextProvider) private readonly requestScopedContextProvider: RequestScopedContextProvider,
    private readonly router: RouterType,
  ) {
    this.router = BaseRouter();

    // Main
    this.router.get('/', async (request) => await this.getDocsHandler.handleRequest(request));
    this.router.all('/v1/*', this.v1Router.router.handle);
    this.router.all('/v2/*', this.v2Router.router.handle);
    this.router.all('*', () => {
      return errorResponseFactory.createNotFoundResponse('Not found');
    });
  }

  public serve = async (ctx: Context, next: Next): Promise<void> => {
    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    const request = RequestMapper.mapRequest(ctx);
    requestScopedContext.setRequest(request);
    const response = await this.router.handle(request);
    requestScopedContext.setResponse(response);

    if (response.status === 204) {
      ctx.response.body = null;
    } else {
      ctx.response.body = await response.json();
    }

    ctx.response.status = response.status;
    response.headers.forEach((value: string, key: string) => {
      ctx.set(key, value);
    });
  };
}
