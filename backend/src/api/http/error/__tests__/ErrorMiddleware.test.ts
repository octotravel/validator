import { HttpBadRequest, HttpError } from '@octocloud/core';
import Koa from 'koa';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ConsoleLogger } from '../../../../common/logger/console/ConsoleLogger';
import { errorMiddleware } from '../ErrorMiddleware';

const mocks = vi.hoisted(() => ({
  consoleLoggerError: vi.fn(),
}));

vi.mock('../../../../common/di/container', () => ({
  container: {
    get: (): Pick<ConsoleLogger, 'error'> => ({ error: mocks.consoleLoggerError }),
  },
}));

describe('errorMiddleware', () => {
  let app: Koa;
  let context: Koa.Context;

  const failWith = (error: unknown) => async (): Promise<void> => {
    throw error;
  };

  beforeEach(() => {
    mocks.consoleLoggerError.mockReset();
    app = mock<Koa>();
    context = mock<Koa.Context>({ app });
  });

  it('does nothing when the request succeeds', async () => {
    await errorMiddleware(context, async () => undefined);

    expect(mocks.consoleLoggerError).not.toHaveBeenCalled();
    expect(app.emit).not.toHaveBeenCalled();
  });

  it('responds with a client error without reporting it', async () => {
    const error = new HttpBadRequest({ message: 'invalid booking' });

    await errorMiddleware(context, failWith(error));

    expect(context.status).toBe(400);
    expect(context.body).toEqual({ message: 'invalid booking' });
    expect(mocks.consoleLoggerError).toHaveBeenCalledWith(error);
    expect(app.emit).not.toHaveBeenCalled();
  });

  it('responds with a server-side HTTP error and reports it', async () => {
    const error = new HttpError(502, { message: 'supplier failed' });

    await errorMiddleware(context, failWith(error));

    expect(context.status).toBe(502);
    expect(context.body).toEqual({ message: 'supplier failed' });
    expect(app.emit).toHaveBeenCalledWith('error', error, context);
  });

  it('responds with 500 to an unknown error and reports it', async () => {
    const error = new TypeError('boom');

    await errorMiddleware(context, failWith(error));

    expect(context.status).toBe(500);
    expect(context.body).toEqual({ message: 'There was an un-recoverable error, please try again' });
    expect(mocks.consoleLoggerError).toHaveBeenCalledWith(error);
    expect(app.emit).toHaveBeenCalledWith('error', error, context);
  });
});
