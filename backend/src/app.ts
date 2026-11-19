import cors from '@koa/cors';
import { BAD_REQUEST, HttpBadRequest } from '@octocloud/core';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorMiddleware } from './api/http/error/ErrorMiddleware';
import { router } from './api/http/router/RouterMiddleware';
import config from './common/config/config';
import { container } from './common/di/container';
import { ExceptionLogger } from './common/logger/exception/ExceptionLogger';

const exceptionLogger = container.get<ExceptionLogger>('ExceptionLogger');

const app = new Koa({
  env: config.getEnvironment(),
});

app.on('error', (error: unknown, context: Context) => {
  void exceptionLogger.error(error, context);
});

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
