import { ConsoleLogger } from '../logger/console/ConsoleLogger';
import { ExceptionLogger } from '../logger/exception/ExceptionLogger';

interface ProcessErrorTarget {
  on(event: 'unhandledRejection' | 'uncaughtException', listener: (error: unknown) => void): unknown;
  exit(code: number): void;
}

async function logToAll(...logCalls: Array<() => Promise<unknown>>): Promise<void> {
  await Promise.allSettled(logCalls.map(async (logCall) => await logCall()));
}

export function registerProcessErrorHandlers(
  exceptionLogger: ExceptionLogger,
  consoleLogger: ConsoleLogger,
  target: ProcessErrorTarget = process,
): void {
  target.on('unhandledRejection', (reason: unknown) => {
    void logToAll(
      async () => await consoleLogger.error(reason),
      async () => await exceptionLogger.error(reason),
    );
  });

  target.on('uncaughtException', (error: unknown) => {
    void logToAll(
      async () => await consoleLogger.error(error),
      async () => await exceptionLogger.fatal(error),
    ).finally(() => target.exit(1));
  });
}
