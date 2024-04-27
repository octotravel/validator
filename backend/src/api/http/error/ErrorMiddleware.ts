import Koa from 'koa';
import { LoggerFactory } from '../../../common/logger/LoggerFactory';
import { ConsoleLoggerFactory } from '../../../common/logger/ConsoleLoggerFactory';
import { container } from '../../../common/di/container';
import config from '../../../common/config/config';
import { Environment, HttpError } from '@octocloud/core';

const consoleLoggerFactory: LoggerFactory = container.resolve(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

export async function errorMiddleware(context: Koa.Context, next: Koa.Next): Promise<void> {
  try {
    await next();
  } catch (error: any) {
    const env = config.getEnvironment();
    const isDebug = env === Environment.LOCAL || env === Environment.TEST;

    await consoleLogger.error(error);

    let body: any = {};

    if (error instanceof HttpError) {
      context.status = error.status;
      body = {
        ...error.body,
      };
    } else {
      context.status = 500;
      context.body = {
        error: 'INTERNAL_SERVER_ERROR',
        errorMessage: `There was an un-recoverable error, please try again (${error.message}).`,
      };
    }

    body.data = {};
    body.stack = isDebug ? error.stack ?? '' : undefined;
    context.body = body;

    if (context.status === 500) {
      context.app.emit('error', error, context);
    }
  }
}
