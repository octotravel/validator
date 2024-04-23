import Koa, { Context } from 'koa';
import cors from '@koa/cors';
import 'dotenv/config';
import 'reflect-metadata';
import * as Sentry from '@sentry/node';

import { ExceptionLogger } from './common/logger/ExceptionLogger';
import { validatorContainer } from './common/di/index';
import config from './common/config/config';
import { BAD_REQUEST, Environment, HttpBadRequest } from '@octocloud/core';
import { ApiRouter } from './api/ApiRouter';
import koaBody, { HttpMethodEnum } from 'koa-body';
import { errorMiddleware } from './api/http/error/ErrorMiddleware';
import { AsyncLocalStorage } from 'async_hooks';
import { RequestScopedContext } from './common/requestContext/RequestScopedContext';

const apiRouter = validatorContainer.resolve(ApiRouter);
const exceptionLogger: ExceptionLogger = validatorContainer.resolve('ExceptionLogger');
const asyncLocalStorage = new AsyncLocalStorage<{ requestScopedContext: RequestScopedContext }>();

const app = new Koa();
app.env = config.NODE_ENV as Environment;

app.on('error', (err, ctx: Context) => {
  if (config.IS_SENTRY_ENABLED) {
    Sentry.withScope((scope: any) => {
      scope.addEventProcessor((event: Sentry.Event) => {
        return Sentry.addRequestDataToEvent(event, ctx.request);
      });
      exceptionLogger.error(err, ctx);
    });
  }
});

app.use(errorMiddleware);
app.use(cors());
app.use(
  koaBody({
    parsedMethods: [HttpMethodEnum.POST, HttpMethodEnum.PUT, HttpMethodEnum.PATCH, HttpMethodEnum.DELETE],
    onError: (error: Error, context: Context) => {
      throw new HttpBadRequest({
        error: BAD_REQUEST,
        errorMessage: `The request body is not formatted correctly (${error.message}).`,
      });
    },
  }),
);
app.use(async (context: Koa.Context, next: Koa.Next) => {
  const requestScopedContext = new RequestScopedContext();
  await asyncLocalStorage.run({ requestScopedContext }, async () => {
    await apiRouter.serve(context, next);
  });
});

export { asyncLocalStorage, app };
