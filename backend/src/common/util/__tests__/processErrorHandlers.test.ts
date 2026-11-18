import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import config from '../../config/config';
import { ConsoleLogger } from '../../logger/console/ConsoleLogger';
import { ExceptionLogger } from '../../logger/exception/ExceptionLogger';
import { registerProcessErrorHandlers } from '../processErrorHandlers';

class FakeProcess extends EventEmitter {
  public readonly exit = vi.fn();
}

describe('registerProcessErrorHandlers', () => {
  const originalEnabled = config.APP_ENABLE_EXCEPTION_LOGGER;
  let exceptionLogger: ExceptionLogger;
  let consoleLogger: ConsoleLogger;
  let fakeProcess: FakeProcess;

  beforeEach(() => {
    exceptionLogger = mock<ExceptionLogger>();
    vi.mocked(exceptionLogger.error).mockResolvedValue(null);
    vi.mocked(exceptionLogger.fatal).mockResolvedValue(null);
    consoleLogger = mock<ConsoleLogger>();
    vi.mocked(consoleLogger.error).mockResolvedValue(null);
    fakeProcess = new FakeProcess();
  });

  afterEach(() => {
    Object.assign(config, { APP_ENABLE_EXCEPTION_LOGGER: originalEnabled });
  });

  it('registers the handlers even when the exception logger is disabled', () => {
    Object.assign(config, { APP_ENABLE_EXCEPTION_LOGGER: false });

    registerProcessErrorHandlers(exceptionLogger, consoleLogger, fakeProcess);

    expect(fakeProcess.listenerCount('unhandledRejection')).toBe(1);
    expect(fakeProcess.listenerCount('uncaughtException')).toBe(1);
  });

  it('logs an unhandled rejection to both loggers and keeps the process running', async () => {
    const reason = new Error('rejected');
    registerProcessErrorHandlers(exceptionLogger, consoleLogger, fakeProcess);

    fakeProcess.emit('unhandledRejection', reason);

    await vi.waitFor(() => {
      expect(consoleLogger.error).toHaveBeenCalledWith(reason);
      expect(exceptionLogger.error).toHaveBeenCalledWith(reason);
    });
    expect(fakeProcess.exit).not.toHaveBeenCalled();
  });

  it('logs an uncaught exception to the console and as fatal, then exits with code 1', async () => {
    const error = new Error('uncaught');
    registerProcessErrorHandlers(exceptionLogger, consoleLogger, fakeProcess);

    fakeProcess.emit('uncaughtException', error);

    await vi.waitFor(() => expect(fakeProcess.exit).toHaveBeenCalledWith(1));
    expect(consoleLogger.error).toHaveBeenCalledWith(error);
    expect(exceptionLogger.fatal).toHaveBeenCalledWith(error);
  });

  it('still logs to the console and exits when the exception logger fails', async () => {
    const error = new Error('uncaught');
    vi.mocked(exceptionLogger.fatal).mockRejectedValue(new Error('logger down'));
    registerProcessErrorHandlers(exceptionLogger, consoleLogger, fakeProcess);

    fakeProcess.emit('uncaughtException', error);

    await vi.waitFor(() => expect(fakeProcess.exit).toHaveBeenCalledWith(1));
    expect(consoleLogger.error).toHaveBeenCalledWith(error);
  });

  it('still exits when a logger throws synchronously', async () => {
    vi.mocked(consoleLogger.error).mockImplementation(() => {
      throw new Error('stdout closed');
    });
    registerProcessErrorHandlers(exceptionLogger, consoleLogger, fakeProcess);

    fakeProcess.emit('uncaughtException', new Error('uncaught'));

    await vi.waitFor(() => expect(fakeProcess.exit).toHaveBeenCalledWith(1));
    expect(exceptionLogger.fatal).toHaveBeenCalled();
  });
});
