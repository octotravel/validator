import { Environment, HttpError, LogLevel, OctoBadRequestError, RequestContext } from '@octocloud/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import config from '../../../config/config';
import { RequestScopedContext } from '../../../requestContext/RequestScopedContext';
import { RequestScopedContextProvider } from '../../../requestContext/RequestScopedContextProvider';
import { DatadogExceptionLogger } from '../DatadogExceptionLogger';

const mocks = vi.hoisted(() => {
  const span = { setTag: vi.fn() };
  const scope = { active: vi.fn() };

  return {
    pino: vi.fn(),
    multistream: vi.fn(),
    pinoLogger: {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    },
    span,
    scope,
    inject: vi.fn(),
    tracer: null as { scope: () => typeof scope; inject: (...args: unknown[]) => void } | null,
  };
});

vi.mock('pino', () => ({
  default: Object.assign(mocks.pino, { multistream: mocks.multistream }),
}));

vi.mock('../../../util/ddTracer', () => ({
  get ddTracer() {
    return mocks.tracer;
  },
}));

const dashboardUrl = (requestId: string): string =>
  `https://admin.ventrata.com/us1/en/requests?filters%5Bid%5D%5Bequals%5D=${requestId}#dt-row:${requestId}`;

describe('DatadogExceptionLogger', () => {
  const originalEnabled = config.APP_ENABLE_EXCEPTION_LOGGER;
  const setEnabled = (enabled: boolean): void => {
    Object.assign(config, { APP_ENABLE_EXCEPTION_LOGGER: enabled });
  };
  let requestContext: RequestContext;
  let requestScopedContextProvider: RequestScopedContextProvider;
  let logger: DatadogExceptionLogger;

  const loggedCall = (method: keyof typeof mocks.pinoLogger): [Record<string, unknown>, string] =>
    mocks.pinoLogger[method].mock.calls[0] as [Record<string, unknown>, string];

  const createRequestContext = (): RequestContext => {
    const context = new RequestContext({
      request: new Request('https://validator.example.com/v2/octo/bookings', { method: 'POST' }),
      environment: Environment.TEST,
      connection: {
        id: 'connection-id',
        supplierId: 'supplier-id',
        apiKey: 'secret-api-key',
        endpoint: 'https://supplier.example.com',
        accountId: 'account-id',
        name: 'Connection',
      },
      channel: 'validator',
    });
    context.setRequestId('request-id');
    context.setAction('createBooking');

    return context;
  };

  const createScopedContextProvider = (ventrataRequestContext: RequestContext | null): RequestScopedContextProvider => {
    const scopedContext = new RequestScopedContext();

    if (ventrataRequestContext !== null) {
      scopedContext.setVentrataRequestContext(ventrataRequestContext);
    }

    const provider = mock<RequestScopedContextProvider>();
    provider.getRequestScopedContext.mockReturnValue(scopedContext);

    return provider;
  };

  beforeEach(() => {
    setEnabled(true);
    mocks.tracer = null;
    mocks.span.setTag.mockReset();
    mocks.inject.mockReset();
    mocks.scope.active.mockReturnValue(mocks.span);
    mocks.pino.mockReturnValue(mocks.pinoLogger);
    mocks.multistream.mockReturnValue('multistream');
    requestContext = createRequestContext();
    requestScopedContextProvider = createScopedContextProvider(null);
    logger = new DatadogExceptionLogger(requestScopedContextProvider);
  });

  afterEach(() => {
    setEnabled(originalEnabled);
    vi.restoreAllMocks();
  });

  describe('skipped errors', () => {
    it('does nothing when the exception logger is disabled', async () => {
      setEnabled(false);

      await expect(logger.error(new Error('boom'))).resolves.toBeNull();
      expect(mocks.pino).not.toHaveBeenCalled();
    });

    it.each([
      ['an Octo error', new OctoBadRequestError('bad request')],
      ['a rate limit error', new HttpError(429, { message: 'too many requests' })],
    ])('does not log %s', async (_, error) => {
      await expect(logger.error(error)).resolves.toBeNull();
      expect(mocks.pino).not.toHaveBeenCalled();
    });
  });

  describe('error data', () => {
    it('logs an error with the request context passed by the caller', async () => {
      const error = new HttpError(500, { message: 'boom' });

      await expect(logger.error(error, requestContext)).resolves.toBeNull();

      expect(loggedCall('error')).toEqual([
        {
          error: { message: 'boom', kind: 'HttpError', stack: error.stack },
          octo: {
            requestId: 'request-id',
            dashboardUrl: dashboardUrl('request-id'),
            channel: 'validator',
            action: 'createBooking',
            accountId: 'account-id',
            connectionId: 'connection-id',
          },
        },
        'boom',
      ]);
    });

    it('falls back to the request context of the current request scope', async () => {
      const scopedLogger = new DatadogExceptionLogger(createScopedContextProvider(requestContext));

      await scopedLogger.error(new Error('boom'));

      expect(loggedCall('error')[0].octo).toEqual({
        requestId: 'request-id',
        dashboardUrl: dashboardUrl('request-id'),
        channel: 'validator',
        action: 'createBooking',
        accountId: 'account-id',
        connectionId: 'connection-id',
      });
    });

    it('adds http data without the query string from a Koa context and keeps the request-scoped context', async () => {
      const scopedLogger = new DatadogExceptionLogger(createScopedContextProvider(requestContext));
      const koaContext = {
        method: 'POST',
        href: 'https://validator.example.com/v2/octo/bookings?token=secret',
        status: 500,
      };

      await scopedLogger.error(new Error('boom'), koaContext);

      expect(loggedCall('error')[0].http).toEqual({
        method: 'POST',
        url: 'https://validator.example.com/v2/octo/bookings',
        status_code: 500,
      });
      expect(loggedCall('error')[0].octo).toMatchObject({ requestId: 'request-id', channel: 'validator' });
    });

    it('never logs the connection API key', async () => {
      await logger.error(new Error('boom'), requestContext);

      expect(JSON.stringify(loggedCall('error')[0])).not.toContain('secret-api-key');
    });

    it('omits request data when no request context is available', async () => {
      vi.mocked(requestScopedContextProvider.getRequestScopedContext).mockImplementation(() => {
        throw new Error('no context');
      });

      await logger.error(new Error('boom'));

      expect(loggedCall('error')[0]).toEqual({ error: { message: 'boom', kind: 'Error', stack: expect.any(String) } });
    });

    it('omits request values that cannot be read from the context', async () => {
      const emptyContext = new RequestContext({
        request: new Request('https://validator.example.com/'),
        environment: Environment.TEST,
      });
      emptyContext.setRequestId('request-id');

      await logger.error(new Error('boom'), emptyContext);

      expect(loggedCall('error')[0].octo).toEqual({
        requestId: 'request-id',
        dashboardUrl: dashboardUrl('request-id'),
      });
    });

    it('logs a string message passed as an error without error kind or stack', async () => {
      await logger.error('Failed to save request log', requestContext);

      expect(loggedCall('error')).toEqual([
        expect.objectContaining({ error: { message: 'Failed to save request log' } }),
        'Failed to save request log',
      ]);
    });

    it('logs values that are neither errors nor strings with an empty message', async () => {
      await logger.error({ code: 42 });

      expect(loggedCall('error')).toEqual([{ error: { message: '' } }, '']);
    });
  });

  describe('log levels', () => {
    it.each([
      ['fatal', 'error'],
      ['error', 'error'],
      ['warn', 'warn'],
      ['log', 'info'],
      ['info', 'info'],
      ['debug', 'debug'],
    ] as const)('writes %s through pino %s', async (method, pinoMethod) => {
      await logger[method]('message');

      expect(mocks.pinoLogger[pinoMethod]).toHaveBeenCalledWith({ error: { message: 'message' } }, 'message');
    });

    it('swallows an unknown log level', async () => {
      await expect(logger.logLevel('unknown' as LogLevel, 'message')).resolves.toBeNull();
    });

    it('never throws when writing the log fails', async () => {
      mocks.pinoLogger.error.mockImplementation(() => {
        throw new Error('stream closed');
      });

      await expect(logger.error(new Error('boom'))).resolves.toBeNull();
    });
  });

  describe('active trace span', () => {
    beforeEach(() => {
      mocks.tracer = { scope: () => mocks.scope, inject: mocks.inject };
    });

    it('adds the trace and span IDs to the log', async () => {
      mocks.inject.mockImplementation((_span: unknown, _format: unknown, record: Record<string, unknown>) => {
        record.dd = { trace_id: 'trace-id', span_id: 'span-id' };
      });

      await logger.error(new Error('boom'));

      expect(mocks.inject).toHaveBeenCalledWith(mocks.span, 'log', expect.any(Object));
      expect(loggedCall('error')[0].dd).toEqual({ trace_id: 'trace-id', span_id: 'span-id' });
    });

    it('tags the span with the request data and marks it as failed', async () => {
      const error = new Error('boom');

      await logger.error(error, requestContext);

      expect(mocks.span.setTag.mock.calls).toEqual([
        ['octo.requestId', 'request-id'],
        ['octo.dashboardUrl', dashboardUrl('request-id')],
        ['octo.channel', 'validator'],
        ['octo.action', 'createBooking'],
        ['octo.accountId', 'account-id'],
        ['octo.connectionId', 'connection-id'],
        ['error', error],
      ]);
    });

    it('marks the span as failed for a fatal error', async () => {
      const error = new Error('boom');

      await logger.fatal(error);

      expect(mocks.span.setTag).toHaveBeenCalledWith('error', error);
    });

    it.each([
      ['a warning', async (): Promise<null> => await logger.warn(new Error('slow'))],
      ['an error message that is not an Error', async (): Promise<null> => await logger.error('failed')],
    ])('does not mark the span as failed for %s', async (_, log) => {
      await log();

      expect(mocks.span.setTag).not.toHaveBeenCalledWith('error', expect.anything());
      expect(mocks.pinoLogger.error.mock.calls.length + mocks.pinoLogger.warn.mock.calls.length).toBe(1);
    });

    it('does not tag a span for a skipped error', async () => {
      await logger.error(new OctoBadRequestError('bad request'), requestContext);

      expect(mocks.span.setTag).not.toHaveBeenCalled();
    });

    it('still logs when there is no active span', async () => {
      mocks.scope.active.mockReturnValue(null);

      await logger.error(new Error('boom'), requestContext);

      expect(mocks.pinoLogger.error).toHaveBeenCalledOnce();
      expect(mocks.inject).not.toHaveBeenCalled();
    });
  });

  describe('pino logger', () => {
    it('creates one pino logger writing Datadog fields to stdout and errors to stderr', async () => {
      await logger.error(new Error('first'));
      await logger.warn('second');

      expect(mocks.pino).toHaveBeenCalledOnce();
      expect(mocks.multistream).toHaveBeenCalledWith(
        [
          { level: 'debug', stream: process.stdout },
          { level: 'error', stream: process.stderr },
          { level: 'fatal', stream: process.stderr },
        ],
        { dedupe: true },
      );

      const [options, stream] = mocks.pino.mock.calls[0];
      expect(stream).toBe('multistream');
      expect(options).toMatchObject({ level: 'debug', base: null, timestamp: false, messageKey: 'message' });
      expect(options.formatters.bindings()).toEqual({});
      expect(options.formatters.level('error')).toEqual({ status: 'error' });
    });
  });
});
