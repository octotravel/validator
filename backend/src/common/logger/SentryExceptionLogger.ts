import { HttpError, LogicError, LogLevel, OctoError, RequestContext } from '@octocloud/core';
import * as Sentry from '@sentry/node';
import { Context } from 'koa';
import config from '../config/config';
import { ExceptionLogger } from './ExceptionLogger';

export class SentryExceptionLogger implements ExceptionLogger {
  public static readonly IGNORED_ERRORS = [];

  public async fatal(data: Error, context?: Context | RequestContext): Promise<unknown> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: Error, context?: Context | RequestContext): Promise<unknown> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: string, context?: Context | RequestContext): Promise<unknown> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: string, context?: Context | RequestContext): Promise<unknown> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: string, context?: Context | RequestContext): Promise<unknown> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: string, context?: Context | RequestContext): Promise<unknown> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  // biome-ignore lint/suspicious/noExplicitAny: abstraction
  public async logLevel(level: LogLevel, data: any, context?: Context | RequestContext): Promise<unknown> {
    if (
      !config.IS_SENTRY_ENABLED ||
      data instanceof OctoError ||
      (data instanceof HttpError &&
        ((data.status >= 400 && data.status < 500) || (data.statusLog >= 400 && data.statusLog < 500)))
    ) {
      return null;
    }

    let errorMessage = '';

    if (typeof data === 'string') {
      errorMessage = data;
    } else if (data instanceof Error) {
      errorMessage = data.message;
    }

    if (errorMessage !== '' && SentryExceptionLogger.IGNORED_ERRORS.some((error) => errorMessage.includes(error))) {
      return null;
    }

    Sentry.withScope(async (scope: Sentry.Scope) => {
      let requestContext = (context as Context)?.requestContext ?? undefined;

      if (requestContext === undefined) {
        requestContext = context;
      }

      if (requestContext !== undefined && requestContext instanceof RequestContext) {
        try {
          // biome-ignore lint/suspicious/noExplicitAny: allow all fields
          const sentryOctoContext: any = {};

          const requestId = this.getContextValue(() => requestContext.getRequestId());
          const channel = this.getContextValue(() => requestContext.getChannel());
          const action = this.getContextValue(() => requestContext.getAction());
          const accountId = this.getContextValue(() => requestContext.getAccountId());
          const connection = this.getContextValue(() => requestContext.getConnection());

          sentryOctoContext.requestId = requestId;
          sentryOctoContext.channel = channel;
          sentryOctoContext.action = action;
          sentryOctoContext.accountId = accountId;
          sentryOctoContext.connection = connection;

          Sentry.setTag(
            'octo.requestId',
            `${requestId} (https://dashboard.ventrata.com/admin/en/requests?fixed_filters[id]=${requestId} #dt-row:${requestId})`,
          );

          if (channel !== undefined) {
            Sentry.setTag('octo.channel', channel);
          }

          if (action !== undefined && action.trim() !== '') {
            Sentry.setTag('octo.action', action);
          }

          if (accountId !== undefined) {
            Sentry.setTag('octo.accountId', accountId);
          }

          if (connection !== undefined) {
            Sentry.setTag('octo.connectionId', connection.id);
          }

          Sentry.setContext('octo', sentryOctoContext);
        } catch (e: unknown) {
          // Report exception regardless invalid context
        }
      }

      try {
        const request = requestContext.getRequest();

        const requestHeaders: Record<string, unknown> = {};
        request.headers.forEach((value: unknown, key: string | number) => {
          requestHeaders[key] = value;
        });

        Sentry.setExtra('request_method', request.method);
        Sentry.setExtra('request_headers', requestHeaders);
        Sentry.setExtra('request_body', (await request.text()) ?? '');
      } catch (e: unknown) {
        // Report exception regardless invalid context
      }

      try {
        const response = requestContext.getResponse();

        if (response !== null) {
          const responseHeaders: Record<string, unknown> = {};
          response.headers.forEach((value: unknown, key: string | number) => {
            responseHeaders[key] = value;
          });

          Sentry.setExtra('response_status', response.status);
          Sentry.setExtra('response_headers', responseHeaders);
          Sentry.setExtra('response_body', await response.text());
        }
      } catch (e: unknown) {
        // Report exception regardless invalid context
      }

      let exceptionId: string | null;

      if (level === LogLevel.FATAL) {
        exceptionId = Sentry.captureException(data, { level });
      } else if (level === LogLevel.ERROR) {
        exceptionId = Sentry.captureException(data, { level });
      } else if (level === LogLevel.WARNING) {
        exceptionId = Sentry.captureMessage(data, { level });
      } else if (level === LogLevel.LOG || level === LogLevel.INFO) {
        exceptionId = Sentry.captureMessage(data, { level });
      } else if (level === LogLevel.DEBUG) {
        exceptionId = Sentry.captureMessage(data, { level });
      } else {
        throw new LogicError(`Used uknown log level "${level}".`);
      }

      if (exceptionId !== null) {
        await Sentry.flush();
      }
    });

    return null;
  }

  public getContextValue<T>(callback: () => T): T | undefined {
    try {
      return callback();
    } catch (e: unknown) {
      return undefined;
    }
  }
}
