import { Environment, HttpError } from '@octocloud/core';
import Koa from 'koa';
import config from '../../../common/config/config';
import { container } from '../../../common/di/container';
import { ConsoleLoggerFactory } from '../../../common/logger/ConsoleLoggerFactory';
import { LoggerFactory } from '../../../common/logger/LoggerFactory';

const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

export async function errorMiddleware(context: Koa.Context, next: Koa.Next): Promise<void> {
  try {
    await next();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    const env = config.getEnvironment();
    const isDebug = env === Environment.LOCAL || env === Environment.TEST;

    await consoleLogger.error(error);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    body.stack = isDebug ? (error.stack ?? '') : undefined;
    context.body = body;

    if (context.status === 500) {
      context.app.emit('error', error, context);
    }
  }
}
