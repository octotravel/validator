import Koa, { Context } from 'koa';
import cors from '@koa/cors';
import 'dotenv/config';
import 'reflect-metadata';
import * as Sentry from '@sentry/node';

import { ExceptionLogger } from './common/logger/ExceptionLogger';
import { validatorContainer } from './common/di/index';
import config from './common/config/config';
import { Environment } from '@octocloud/core';
import { ApiRouter } from './api/ApiRouter';
import koaBody from 'koa-body';
import { errorMiddleware } from './api/http/error/ErrorMiddleware';

const apiRouter = validatorContainer.resolve(ApiRouter);
const exceptionLogger: ExceptionLogger = validatorContainer.resolve('ExceptionLogger');

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

app.use(cors());
app.use(koaBody());
app.use(errorMiddleware);
app.use(async (context: Koa.Context, next: Koa.Next) => {
  await apiRouter.serve(context, next);
});

export { app };
