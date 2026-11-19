import { inject } from '@needle-di/core';
import { HttpError, LogicError, LogLevel, OctoError, RequestContext } from '@octocloud/core';
import pino, { LoggerOptions, Logger as PinoLogger } from 'pino';
import config from '../../config/config';
import { RequestScopedContextProvider } from '../../requestContext/RequestScopedContextProvider';
import { ddTracer } from '../../util/ddTracer';
import { ExceptionLogger } from './ExceptionLogger';

interface DatadogErrorData {
  message: string;
  kind?: string;
  stack?: string;
}

interface DatadogHttpData {
  method: string;
  url: string;
  status_code: number;
}

interface DatadogOctoData {
  requestId?: string;
  dashboardUrl?: string;
  channel?: string;
  action?: string;
  accountId?: string;
  connectionId?: string;
}

interface DatadogLogData {
  error: DatadogErrorData;
  http?: DatadogHttpData;
  octo?: DatadogOctoData;
}

export class DatadogExceptionLogger implements ExceptionLogger {
  private pinoLogger: PinoLogger | undefined;

  public constructor(
    private readonly requestScopedContextProvider: RequestScopedContextProvider = inject(RequestScopedContextProvider),
  ) {}

  public async fatal(data: unknown, context?: unknown): Promise<null> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: unknown, context?: unknown): Promise<null> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: unknown, context?: unknown): Promise<null> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: unknown, context?: unknown): Promise<null> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: unknown, context?: unknown): Promise<null> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: unknown, context?: unknown): Promise<null> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  public async logLevel(level: LogLevel, data: unknown, context?: unknown): Promise<null> {
    try {
      if (
        !config.APP_ENABLE_EXCEPTION_LOGGER ||
        data instanceof OctoError ||
        (data instanceof HttpError && data.status === 429)
      ) {
        return null;
      }

      const logData = this.createLogData(data, context);
      const message = logData.error.message;

      this.linkToActiveSpan(level, data, logData);

      if (level === LogLevel.FATAL || level === LogLevel.ERROR) {
        this.getPinoLogger().error(logData, message);
      } else if (level === LogLevel.WARNING) {
        this.getPinoLogger().warn(logData, message);
      } else if (level === LogLevel.LOG || level === LogLevel.INFO) {
        this.getPinoLogger().info(logData, message);
      } else if (level === LogLevel.DEBUG) {
        this.getPinoLogger().debug(logData, message);
      } else {
        throw new LogicError(`Used unknown log level "${level}".`);
      }

      return null;
    } catch (e: unknown) {
      return null;
    }
  }

  private linkToActiveSpan(level: LogLevel, data: unknown, logData: DatadogLogData): void {
    const ddSpan = ddTracer?.scope()?.active() ?? null;

    if (ddTracer === null || ddSpan === null) {
      return;
    }

    ddTracer.inject(ddSpan, 'log', logData);

    Object.entries(logData.octo ?? {}).forEach(([key, value]) => {
      ddSpan.setTag(`octo.${key}`, value);
    });

    if ((level === LogLevel.FATAL || level === LogLevel.ERROR) && data instanceof Error) {
      ddSpan.setTag('error', data);
    }
  }

  private createLogData(data: unknown, context: unknown): DatadogLogData {
    const logData: DatadogLogData = { error: this.createErrorData(data) };
    const httpData = this.createHttpData(context);
    const requestContext = this.getRequestContext(context);

    if (httpData !== undefined) {
      logData.http = httpData;
    }

    if (requestContext !== undefined) {
      logData.octo = this.createOctoData(requestContext);
    }

    return logData;
  }

  private createErrorData(data: unknown): DatadogErrorData {
    if (data instanceof Error) {
      return { message: data.message, kind: data.constructor.name, stack: data.stack };
    }

    return { message: typeof data === 'string' ? data : '' };
  }

  private createHttpData(context: unknown): DatadogHttpData | undefined {
    if (
      typeof context !== 'object' ||
      context === null ||
      !('method' in context) ||
      !('href' in context) ||
      !('status' in context) ||
      typeof context.method !== 'string' ||
      typeof context.href !== 'string' ||
      typeof context.status !== 'number'
    ) {
      return undefined;
    }

    const url = new URL(context.href);

    return { method: context.method, url: `${url.origin}${url.pathname}`, status_code: context.status };
  }

  private getRequestContext(context: unknown): RequestContext | undefined {
    if (context instanceof RequestContext) {
      return context;
    }

    return this.getContextValue(() =>
      this.requestScopedContextProvider.getRequestScopedContext().getVentrataRequestContext(),
    );
  }

  private createOctoData(requestContext: RequestContext): DatadogOctoData {
    const octoData: DatadogOctoData = {};
    const requestId = this.getContextValue(() => requestContext.getRequestId());
    const channel = this.getContextValue(() => requestContext.getChannel());
    const action = this.getContextValue(() => requestContext.getAction());
    const accountId = this.getContextValue(() => requestContext.getAccountId());
    const connectionId = this.getContextValue(() => requestContext.getConnection().id);

    if (requestId !== undefined && requestId !== '') {
      octoData.requestId = requestId;
      octoData.dashboardUrl = `https://admin.ventrata.com/us1/en/requests?filters%5Bid%5D%5Bequals%5D=${requestId}#dt-row:${requestId}`;
    }

    if (channel !== undefined && channel.trim() !== '') {
      octoData.channel = channel;
    }

    if (action !== undefined && action.trim() !== '') {
      octoData.action = action;
    }

    if (accountId !== undefined && accountId.trim() !== '') {
      octoData.accountId = accountId;
    }

    if (connectionId !== undefined) {
      octoData.connectionId = connectionId;
    }

    return octoData;
  }

  private getContextValue<T>(callback: () => T): T | undefined {
    try {
      return callback() ?? undefined;
    } catch (e: unknown) {
      return undefined;
    }
  }

  private getPinoLogger(): PinoLogger {
    if (this.pinoLogger === undefined) {
      const streams = [
        { level: 'debug', stream: process.stdout },
        { level: 'error', stream: process.stderr },
        { level: 'fatal', stream: process.stderr },
      ];

      const pinoOptions: LoggerOptions = {
        level: 'debug',
        base: null,
        timestamp: false,
        messageKey: 'message',
        formatters: {
          bindings: () => ({}),
          level: (label) => ({ status: label }),
        },
      };

      this.pinoLogger = pino(pinoOptions, pino.multistream(streams, { dedupe: true }));
    }

    return this.pinoLogger;
  }
}
