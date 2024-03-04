import { InjectionToken, container } from 'tsyringe';
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
import { UpdateSessionHandler } from '../../api/v2/session/UpdateSessionHandler';
import { GetSessionHandler } from '../../api/v2/session/GetSessionHandler';
import { BackendContainer } from '@octocloud/backend';
import { Backend, BaseConfig } from '@octocloud/core';
import config from '../config/config';
import { V1Router } from '../../api/v1/V1Router';
import { V2Router } from '../../api/v2/V2Router';
import { SessionFacade } from '../validation/v2/session/SessionFacade';
import { SessionService } from '../validation/v2/session/SessionService';
import { SessionRepository } from '../validation/v2/session/SessionRepository';
import { PostgresSessionRepository } from '../validation/v2/session/PostgresSessionRepository';
import { ScenarioFacade } from '../validation/v2/scenario/ScenarioFacade';
import { ScenarioRepository } from '../validation/v2/scenario/ScenarioRepository';
import { InMemoryScenarioRepository } from '../validation/v2/scenario/InMemoryScenarioRepository';
import { GetSupplierHandler } from '../../api/v2/reseller/octo/supplier/GetSupplierHandler';
import { GetScenariosHandler } from '../../api/v2/reseller/scenario/GetScenariosHandler';
import { OctoRouter } from '../../api/v2/reseller/octo/OctoRouter';
import { ResellerRouter } from '../../api/v2/reseller/ResellerRouter';
import { BasicScenario } from '../validation/v2/scenario/reseller/BasicScenario';
import { AuthMiddleware } from '../../api/v2/reseller/octo/AuthMiddleware';
import { HeaderValidatorMiddleware } from '../../api/v2/reseller/octo/HeaderValidatorMiddleware';
import { GetCapabilitiesHandler } from '../../api/v2/reseller/capabilities/GetCapabilitiesHandler';
import { SocketIo } from '../socketio/SocketIo';
import { WebSocket } from '../socketio/WebSocket';

export const validatorContainer = container.createChildContainer();

const consoleLoggerFactory = new ConsoleLoggerFactory();
const consoleLogger = consoleLoggerFactory.create();

const baseConfig = new BaseConfig({
  environment: config.getEnvironment(),
  productionURL: config.BACKEND_ENDPOINT_URL, // TODO unite in core to just "url"
  stagingURL: config.BACKEND_ENDPOINT_URL, // TODO remove in core
});

const backend = new BackendContainer({ config: baseConfig, logger: consoleLogger }).backend;
const backendToken: InjectionToken<Backend> = 'Backend';
validatorContainer.registerInstance(backendToken, backend);

// Database
validatorContainer.registerSingleton(Database);
validatorContainer.registerSingleton(Migrator);

// WebSocket
validatorContainer.registerSingleton<WebSocket>('WebSocket', SocketIo);

// Logger
validatorContainer.registerSingleton(ConsoleLoggerFactory);
validatorContainer.registerSingleton<ExceptionLogger>('ExceptionLogger', SentryExceptionLogger);

// Session
validatorContainer.registerSingleton(SessionFacade);
validatorContainer.registerSingleton(SessionService);
validatorContainer.registerSingleton<SessionRepository>('SessionRepository', PostgresSessionRepository);

// Scenario
// Session
validatorContainer.registerSingleton(ScenarioFacade);
validatorContainer.registerSingleton<ScenarioRepository>('ScenarioRepository', InMemoryScenarioRepository);

// API
validatorContainer.registerSingleton(ApiRouter);
validatorContainer.registerSingleton(GetDocsHandler);
validatorContainer.registerSingleton(GetSessionHandler);
validatorContainer.registerSingleton(UpdateSessionHandler);
validatorContainer.registerSingleton(UpdateSessionHandler);

// Commands
validatorContainer.registerSingleton(AnsibleDecryptCommand);
validatorContainer.registerSingleton(AnsibleEncryptCommand);
validatorContainer.registerSingleton(ClearDbCommand);
validatorContainer.registerSingleton(MigrateDbCommand);

// V1 validator
validatorContainer.registerSingleton(V1Router);
validatorContainer.registerSingleton(ValidationController);

// V2 validator
validatorContainer.registerSingleton(V2Router);
validatorContainer.registerSingleton(OctoRouter);
validatorContainer.registerSingleton(ResellerRouter);
validatorContainer.registerSingleton(AuthMiddleware);
validatorContainer.registerSingleton(HeaderValidatorMiddleware);
validatorContainer.registerSingleton(GetSupplierHandler);
validatorContainer.registerSingleton(GetScenariosHandler);
validatorContainer.registerSingleton(GetCapabilitiesHandler);

// Reseller Scenarios
validatorContainer.registerSingleton(BasicScenario);
