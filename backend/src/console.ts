import 'dotenv/config';
import 'reflect-metadata';
import { LoggerFactory } from './common/logger/LoggerFactory';
import { Command } from './console/command/Command';
import { ExceptionLogger } from './common/logger/ExceptionLogger';
import { container } from './common/di/container';
import { ConsoleLoggerFactory } from './common/logger/ConsoleLoggerFactory';
import { Database } from './common/database/Database';
import { SentryUtil } from './common/util/SentryUtil';
import { asyncLocalStorage } from './common/di/asyncLocalStorage';
import { RequestScopedContext } from './common/requestContext/RequestScopedContext';

const database: Database = container.resolve(Database);
const exceptionLogger: ExceptionLogger = container.resolve('ExceptionLogger');
const consoleLoggerFactory: LoggerFactory = container.resolve(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create('console');

(async () => {
  try {
    SentryUtil.initSentry();

    const commandName = process.argv[2] ?? null;
    const availableCommands: Command[] = container.resolveAll('Command');

    if (commandName === null) {
      let infoMessage = '\n\n\x1b[33mUsage:\x1b[0m\n';
      infoMessage += ' console [command] [arguments]\n\n';

      infoMessage += '\x1b[33mAvailable commands:\x1b[0m\n';
      infoMessage += '\x1b[32m'; // Green color
      for (const availableCommand of availableCommands) {
        infoMessage += `  ${availableCommand.getSlug()}\n`;
      }
      infoMessage += '\x1b[0m'; // End of green color

      await consoleLogger.log(infoMessage);
      process.exit(0);
    }

    for (const availableCommand of availableCommands) {
      if (availableCommand.getSlug() !== commandName) {
        continue;
      }

      const command: Command = container.resolve(availableCommand.constructor.name);
      const consoleLoggerFactory: LoggerFactory = container.resolve(ConsoleLoggerFactory);
      const consoleLogger = consoleLoggerFactory.create(commandName);
      const requestScopedContext = new RequestScopedContext();
      await asyncLocalStorage.run({ requestScopedContext }, async () => {
        await command.run(...process.argv.slice(3));
      });
    }

    await database.endPool();
    await SentryUtil.endSentry();
    process.exit(0);
  } catch (err: any) {
    await consoleLogger.error(err);
    await exceptionLogger.error(err);
    await database.endPool();
    await SentryUtil.endSentry();
    process.exit(1);
  }
})();
