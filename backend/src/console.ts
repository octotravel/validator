import './common/util/sentry';
import { Database } from './common/database/Database';
import { asyncLocalStorage } from './common/di/asyncLocalStorage';
import { container } from './common/di/container';
import { ConsoleLogger } from './common/logger/console/ConsoleLogger';
import { ExceptionLogger } from './common/logger/exception/ExceptionLogger';
import { RequestScopedContext } from './common/requestContext/RequestScopedContext';
import { Command } from './console/command/Command';

const database: Database = container.get('Database');
const exceptionLogger: ExceptionLogger = container.get('ExceptionLogger');
const consoleLogger = container.get<ConsoleLogger>('ConsoleLogger');

(async () => {
  try {
    const commandName = process.argv[2] ?? null;
    const availableCommands: Command[] = container.get('Command', { multi: true });
    availableCommands.sort((a, b) => a.getSlug().localeCompare(b.getSlug()));

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

      const command: Command = container.get(availableCommand.constructor.name);
      const requestScopedContext = new RequestScopedContext();
      await asyncLocalStorage.run({ requestScopedContext }, async () => {
        await command.run(...process.argv.slice(3));
      });
    }

    await database.endPool();
    process.exit(0);
  } catch (err: unknown) {
    await consoleLogger.error(err);
    await exceptionLogger.error(err);
    await database.endPool();
    process.exit(1);
  }
})().catch(async (err: unknown) => {
  try {
    await consoleLogger.error(err);
    await exceptionLogger.error(err);
    await database.endPool();
  } finally {
    process.exit(1);
  }
});
