import { InjectionToken, container as tsyringeContainer } from 'tsyringe';
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
import { GetCapabilitiesHandler } from '../../api/v2/reseller/capabilities/GetCapabilitiesHandler';
import { SocketIo } from '../socketio/SocketIo';
import { WebSocket } from '../socketio/WebSocket';
import { AvailabilityCalendarHandler } from '../../api/v2/reseller/octo/availability/AvailabilityCalendarHandler';
import { AdvancedScenario } from '../validation/v2/scenario/reseller/AdvancedScenario';
import { SessionStepGuard } from '../validation/v2/session/SessionStepGuard';
import { SessionStepValidationProcessor } from '../validation/v2/session/SessionStepValidationProcessor';
import { SessionScenarioProgressProvider } from '../validation/v2/session/SessionScenarioProgressProvider';
import { RequestLogRepository } from '../requestLog/RequestLogRepository';
import { PostgresRequestLogRepository } from '../requestLog/PostgresRequestLogRepository';
import { RequestLogService } from '../requestLog/RequestLogService';
import { RequestScopedContextProvider } from '../requestContext/RequestScopedContextProvider';
import { LoggerFactory } from '../logger/LoggerFactory';

export const container = tsyringeContainer.createChildContainer();

// Logger
container.registerSingleton<LoggerFactory>('ConsoleLoggerFactory', ConsoleLoggerFactory);
container.registerSingleton<ExceptionLogger>('ExceptionLogger', SentryExceptionLogger);

const consoleLoggerFactory: ConsoleLoggerFactory = container.resolve('ConsoleLoggerFactory');
const consoleLogger = consoleLoggerFactory.create();

const baseConfig = new BaseConfig({
  environment: config.getEnvironment(),
  productionURL: config.BACKEND_ENDPOINT_URL, // TODO unite in core to just "url"
  stagingURL: config.BACKEND_ENDPOINT_URL, // TODO remove in core
});

const backend = new BackendContainer({ config: baseConfig, logger: consoleLogger }).backend;
const backendToken: InjectionToken<Backend> = 'Backend';
container.registerInstance(backendToken, backend);

// Database
container.registerSingleton(Database);
container.registerSingleton(Migrator);

// Request Context
container.registerSingleton(RequestScopedContextProvider);

// Request Log
container.registerSingleton<RequestLogRepository>('RequestLogRepository', PostgresRequestLogRepository);
container.registerSingleton(RequestLogService);

// WebSocket
container.registerSingleton<WebSocket>('WebSocket', SocketIo);

// Session
container.registerSingleton(SessionScenarioProgressProvider);
container.registerSingleton(SessionFacade);
container.registerSingleton<SessionRepository>('SessionRepository', PostgresSessionRepository);
container.registerSingleton(SessionService);
container.registerSingleton(SessionStepGuard);
container.registerSingleton(SessionStepValidationProcessor);

// Scenario
// Session
container.registerSingleton(ScenarioFacade);
container.registerSingleton<ScenarioRepository>('ScenarioRepository', InMemoryScenarioRepository);

// API
container.registerSingleton(ApiRouter);
container.registerSingleton(GetDocsHandler);
container.registerSingleton(GetSessionHandler);
container.registerSingleton(UpdateSessionHandler);
container.registerSingleton(UpdateSessionHandler);

// Commands
container.registerSingleton(AnsibleDecryptCommand);
container.registerSingleton(AnsibleEncryptCommand);
container.registerSingleton(ClearDbCommand);
container.registerSingleton(MigrateDbCommand);

// V1 validator
container.registerSingleton(V1Router);
container.registerSingleton(ValidationController);

// V2 validator
container.registerSingleton(V2Router);
container.registerSingleton(OctoRouter);
container.registerSingleton(ResellerRouter);
container.registerSingleton(AuthMiddleware);
container.registerSingleton(GetSupplierHandler);
container.registerSingleton(GetScenariosHandler);
container.registerSingleton(GetCapabilitiesHandler);
container.registerSingleton(AvailabilityCalendarHandler);

// Reseller Scenarios
container.registerSingleton(AdvancedScenario);
container.registerSingleton(BasicScenario);
