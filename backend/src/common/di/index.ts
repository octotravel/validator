import { container } from 'tsyringe';
import { ConsoleLoggerFactory } from '../logger/ConsoleLoggerFactory';
import { Database } from '../database/Database';
import { Migrator } from '../database/Migrator';
import { ExceptionLogger } from '../logger/ExceptionLogger';
import { SentryExceptionLogger } from '../logger/SentryExceptionLogger';
import { ApiRouter } from '../../api/ApiRouter';
import { AnsibleDecryptCommand } from '../../console/command/AnsibleDecryptCommand';
import { AnsibleEncryptCommand } from '../../console/command/AnsibleEncryptCommand';
import { ClearDbCommand } from '../../console/command/ClearDbCommand';
import { MigrateDbCommand } from '../../console/command/MigrateDbCommand';
import { RequestMapper } from '../../api/http/request/RequestMapper';

export const validatorContainer = container.createChildContainer();

const consoleLoggerFactory = new ConsoleLoggerFactory();
const consoleLogger = consoleLoggerFactory.create();

// Database
validatorContainer.registerSingleton(Database);
validatorContainer.registerSingleton(Migrator);

// Logger
validatorContainer.registerSingleton(ConsoleLoggerFactory);
validatorContainer.registerSingleton<ExceptionLogger>('ExceptionLogger', SentryExceptionLogger);

// API
validatorContainer.registerSingleton(ApiRouter);
validatorContainer.registerSingleton(RequestMapper);

// Commands
validatorContainer.registerSingleton(AnsibleDecryptCommand);
validatorContainer.registerSingleton(AnsibleEncryptCommand);
validatorContainer.registerSingleton(ClearDbCommand);
validatorContainer.registerSingleton(MigrateDbCommand);
