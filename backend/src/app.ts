import 'dotenv/config';
import 'reflect-metadata';
import Koa, { Context } from 'koa';
import cors from '@koa/cors';
import * as Sentry from '@sentry/node';

import { ExceptionLogger } from './common/logger/ExceptionLogger';
import { container } from './common/di/container';
import config from './common/config/config';
import { errorMiddleware } from './api/http/error/ErrorMiddleware';
import { router } from './api/http/router/RouterMiddleware';
import koaBody, { HttpMethodEnum } from 'koa-body';
import { BAD_REQUEST, HttpBadRequest } from '@octocloud/core';

const exceptionLogger: ExceptionLogger = container.resolve('ExceptionLogger');

const app = new Koa({
  env: config.getEnvironment(),
});

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
// app.use(cors);
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
app.use(router);

export { app };
