import Koa from 'koa';
import { HttpError as OctoHttpError } from '@octocloud/core';
import { LoggerFactory } from '../../../common/logger/LoggerFactory';
import { ConsoleLoggerFactory } from '../../../common/logger/ConsoleLoggerFactory';
import { validatorContainer } from '../../../common/di/index';
import { config } from 'dotenv';

const consoleLoggerFactory: LoggerFactory = validatorContainer.resolve(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

export async function errorMiddleware(context: Koa.Context, next: Koa.Next): Promise<void> {
  try {
    await next();
  } catch (err: any) {
    consoleLogger.error(err);

    context.status = 500;
    context.body = {
      message: err.message ?? 'There was an un-recoverable error, please try again',
      stack: err.stack ?? '',
    };

    context.app.emit('error', err, context);
  }
}
