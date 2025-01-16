import { injectable } from '@needle-di/core';
import { HttpError, InternalError, LogLevel, LogicError, OctoError, RequestContext } from '@octocloud/core';
import * as Sentry from '@sentry/node';
import { Context } from 'koa';
import { ExceptionLogger } from './ExceptionLogger';

@injectable()
export class SentryExceptionLogger implements ExceptionLogger {
  public async fatal(data: Error, context?: Context): Promise<unknown> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: Error, context?: Context): Promise<unknown> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: string, context?: Context): Promise<unknown> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: string, context?: Context): Promise<unknown> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: string, context?: Context): Promise<unknown> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: string, context?: Context): Promise<unknown> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async logLevel(level: LogLevel, data: any, context?: Context): Promise<unknown> {
    if (data instanceof HttpError || data instanceof OctoError || data instanceof InternalError) {
      return null;
    }

    const sentryOctoContext: Record<string, unknown> = {};
    const requestContext = context?.requestContext ?? undefined;

    if (requestContext && requestContext instanceof RequestContext) {
      try {
        sentryOctoContext.requestId = requestContext.getRequestId();
        sentryOctoContext.channel = requestContext.getChannel();
        sentryOctoContext.action = requestContext.getAction();
        sentryOctoContext.accountId = requestContext.getAccountId();
        sentryOctoContext.connection = requestContext.getConnection();
      } catch (e: unknown) {
        // Report exception regardless invalid context
      }
    }

    Sentry.setContext('octo', sentryOctoContext);
    if (level === LogLevel.FATAL) {
      return Sentry.captureException(data, { level });
    } else if (level === LogLevel.ERROR) {
      return Sentry.captureException(data, { level });
    } else if (level === LogLevel.WARNING) {
      return Sentry.captureMessage(data, { level });
    } else if (level === LogLevel.LOG || level === LogLevel.INFO) {
      return Sentry.captureMessage(data, { level });
    } else if (level === LogLevel.DEBUG) {
      return Sentry.captureMessage(data, { level });
    }

    throw new LogicError(`Used uknown log level "${level}".`);
  }
}
