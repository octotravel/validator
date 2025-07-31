import { inject } from '@needle-di/core';
import { RequestContext } from '@octocloud/core';
import { Router as BaseRouter, RouterType } from 'itty-router';
import { Context, Next } from 'koa';
import { RequestLogger } from '../common/logger/request/RequestLogger';
import { RequestScopedContextProvider } from '../common/requestContext/RequestScopedContextProvider';
import { ErrorResponseFactory } from './http/error/ErrorResponseFactory';
import { RequestMapper } from './http/request/RequestMapper';
import { ResellerRouter } from './reseller/ResellerRouter';
import { SupplierRouter } from './supplier/SupplierRouter';
import { V1Router } from './v1/V1Router';
import { GetDocsHandler } from './v2/docs/GetDocsHandler';
import { V2Router } from './v2/V2Router';

export class ApiRouter {
  public constructor(
    private readonly router: RouterType,
    private readonly v1Router = inject(V1Router),
    private readonly v2Router = inject(V2Router),
    private readonly supplierRouter = inject(SupplierRouter),
    private readonly resellerRouter = inject(ResellerRouter),
    private readonly getDocsHandler = inject(GetDocsHandler),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly requestScopedContextProvider = inject(RequestScopedContextProvider),
    private readonly requestLogger: RequestLogger = inject<RequestLogger>('RequestLogger'),
  ) {
    this.router = BaseRouter();

    // Main
    this.router.get('/', async (request) => await this.getDocsHandler.handleRequest(request));
    this.router.all('/v1/*', this.v1Router.router.fetch);
    this.router.all('/v2/*', this.v2Router.router.fetch);
    this.router.all('/supplier/*', this.supplierRouter.router.fetch);
    this.router.all('/reseller/*', this.resellerRouter.router.fetch);
    this.router.all('*', () => {
      return this.errorResponseFactory.createNotFoundResponse('Not found');
    });
  }

  public serve = async (ctx: Context, next: Next): Promise<void> => {
    const requestScopedContext = this.requestScopedContextProvider.getRequestScopedContext();
    const request = RequestMapper.mapRequest(ctx);
    requestScopedContext.setRequest(request);
    const ventrataRequestContext = new RequestContext({
      request,
    });
    ventrataRequestContext.setConnection({
      id: 'id',
      supplierId: 'Viator',
      apiKey: 'apiKey',
      endpoint: 'https://mock.octo.travel',
      accountId: 'accountId',
      name: 'name',
    });
    ventrataRequestContext.setAccountId('accountId');
    requestScopedContext.setVentrataRequestContext(ventrataRequestContext);

    const response = await this.router.fetch(request);
    requestScopedContext.setResponse(response);
    ventrataRequestContext.setResponse(response);

    const ventrataRequestData = ventrataRequestContext.getRequestData();

    if (ventrataRequestData.areLogsEnabled()) {
      this.requestLogger.logAll(ventrataRequestData, ventrataRequestContext);
    }

    if (response.status === 204) {
      ctx.response.body = null;
    } else {
      ctx.response.body = await response.json();
    }

    if (!request.bodyUsed) {
      request.text();
    }

    if (!response.bodyUsed) {
      response.text();
    }

    ctx.response.status = response.status;
    response.headers.forEach((value: string, key: string) => {
      ctx.set(key, value);
    });
  };
}
