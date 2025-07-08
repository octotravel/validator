import { BAD_REQUEST, HttpBadRequest } from '@octocloud/core';
import * as Sentry from '@sentry/node';
import Koa, { Context } from 'koa';
import koaBody, { HttpMethodEnum } from 'koa-body';
import { errorMiddleware } from './api/http/error/ErrorMiddleware';
import { router } from './api/http/router/RouterMiddleware';
import config from './common/config/config';
import { container } from './common/di/container';
import { ExceptionLogger } from './common/logger/ExceptionLogger';

const exceptionLogger: ExceptionLogger = container.get('ExceptionLogger');

const app = new Koa({
  env: config.getEnvironment(),
});

app.on('error', (err, ctx: Context) => {
  if (config.IS_SENTRY_ENABLED) {
    Sentry.withScope((scope: Sentry.Scope) => {
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
    // biome-ignore lint/correctness/noUnusedFunctionParameters: <?>
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
