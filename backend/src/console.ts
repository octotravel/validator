import 'dotenv/config';
import 'reflect-metadata';
import { LoggerFactory } from './common/logger/LoggerFactory';
import { Command } from './console/command/Command';
import { ExceptionLogger } from './common/logger/ExceptionLogger';
import { validatorContainer } from './common/di';
import { ConsoleLoggerFactory } from './common/logger/ConsoleLoggerFactory';
import { Database } from './common/database/Database';
import { endSentry, initSentry } from './common/util/SentryInit';

const database: Database = validatorContainer.resolve(Database);
const exceptionLogger: ExceptionLogger = validatorContainer.resolve('ExceptionLogger');
const consoleLoggerFactory: LoggerFactory = validatorContainer.resolve(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create('console');

(async () => {
  try {
    initSentry();

    const commandName = process.argv[2] ?? null;
    const availableCommands: Command[] = validatorContainer.resolveAll('Command');

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

      const command: Command = validatorContainer.resolve(availableCommand.constructor.name);
      const consoleLoggerFactory: LoggerFactory = validatorContainer.resolve(ConsoleLoggerFactory);
      const consoleLogger = consoleLoggerFactory.create(commandName);
      await command.run(...process.argv.slice(3));
    }

    await database.endPool();
    await endSentry();
    process.exit(0);
  } catch (err: any) {
    await consoleLogger.error(err);
    await exceptionLogger.error(err);
    await database.endPool();
    await endSentry();
    process.exit(1);
  }
})();
