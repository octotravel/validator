import cors from '@koa/cors';
import { BAD_REQUEST, HttpBadRequest } from '@octocloud/core';
import * as Sentry from '@sentry/node';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorMiddleware } from './api/http/error/ErrorMiddleware';
import { router } from './api/http/router/RouterMiddleware';
import config from './common/config/config';

const app = new Koa({
  env: config.getEnvironment(),
});

if (config.SENTRY_ENABLED) {
  Sentry.setupKoaErrorHandler(app);
}

app.use(errorMiddleware);
app.use(cors());
app.use(
  bodyParser({
    onerror: (error: Error, context: Context) => {
      throw new HttpBadRequest({
        error: BAD_REQUEST,
        errorMessage: `The request body is not formatted correctly (${error.message}).`,
      });
    },
  }),
);
app.use(router);

export { app };
