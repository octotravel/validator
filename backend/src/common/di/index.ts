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
import { ValidationController } from '../validation/v1/services/validation/Controller';
import { GetDocsHandler } from '../../api/v2/docs/GetDocsHandler';
import { CreateSessionHandler } from '../../api/v2/session/CreateSessionHandler';
import { UpdateSessionHandler } from '../../api/v2/session/UpdateSessionHandler';
import { SessionFacade } from '../session/SessionFacade';
import { SessionRepository } from '../session/SessionRepository';
import { PostgresSessionRepository } from '../session/PostgresSessionRepository';
import { SessionService } from '../session/SessionService';

export const validatorContainer = container.createChildContainer();

const consoleLoggerFactory = new ConsoleLoggerFactory();
const consoleLogger = consoleLoggerFactory.create();

// Database
validatorContainer.registerSingleton(Database);
validatorContainer.registerSingleton(Migrator);

// Logger
validatorContainer.registerSingleton(ConsoleLoggerFactory);
validatorContainer.registerSingleton<ExceptionLogger>('ExceptionLogger', SentryExceptionLogger);

// Session
validatorContainer.registerSingleton(SessionFacade);
validatorContainer.registerSingleton(SessionService);
validatorContainer.registerSingleton<SessionRepository>('SessionRepository', PostgresSessionRepository);

// API
validatorContainer.registerSingleton(ApiRouter);
validatorContainer.registerSingleton(GetDocsHandler);
validatorContainer.registerSingleton(CreateSessionHandler);
validatorContainer.registerSingleton(UpdateSessionHandler);

// Commands
validatorContainer.registerSingleton(AnsibleDecryptCommand);
validatorContainer.registerSingleton(AnsibleEncryptCommand);
validatorContainer.registerSingleton(ClearDbCommand);
validatorContainer.registerSingleton(MigrateDbCommand);

// V1 validator
validatorContainer.registerSingleton(ValidationController);

// V2 validator
validatorContainer.registerSingleton(ValidationController);
