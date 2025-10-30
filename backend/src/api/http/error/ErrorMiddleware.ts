import { HttpError } from '@octocloud/core';
import Koa from 'koa';
import { container } from '../../../common/di/container';
import { ConsoleLogger } from '../../../common/logger/console/ConsoleLogger';

const consoleLogger = container.get<ConsoleLogger>('ConsoleLogger');

export async function errorMiddleware(context: Koa.Context, next: Koa.Next): Promise<void> {
  try {
    await next();
  } catch (err: unknown) {
    await consoleLogger.error(err);

    if (err instanceof HttpError) {
      context.status = err.status;
      let body: unknown = {};

      if (Object.keys(err.body).length > 0) {
        body = {
          ...err.body,
        };
      } else if (err.error !== '') {
        body = {
          message: err.error,
        };
      } else {
        body = {
          message: err.message,
        };
      }

      context.body = body;
    } else {
      context.status = 500;
      context.body = {
        message: 'There was an un-recoverable error, please try again',
      };

      context.app.emit('error', err, context);
    }
  }
}
