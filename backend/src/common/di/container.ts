import { Container, InjectionToken } from '@needle-di/core';
import { BackendContainer } from '@octocloud/backend';
import { BaseConfig, Environment } from '@octocloud/core';
import { ApiRouter } from '../../api/ApiRouter';
import { ErrorResponseFactory } from '../../api/http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../api/http/json/JsonResponseFactory';
import { V1Router } from '../../api/v1/V1Router';
import { ValidateHandler } from '../../api/v1/validate/ValidateHandler';
import { V2Router } from '../../api/v2/V2Router';
import { GetDocsHandler } from '../../api/v2/docs/GetDocsHandler';
import { ResellerRouter } from '../../api/v2/reseller/ResellerRouter';
import { GetCapabilitiesHandler } from '../../api/v2/reseller/capabilities/GetCapabilitiesHandler';
import { AuthMiddleware } from '../../api/v2/reseller/octo/AuthMiddleware';
import { OctoRouter } from '../../api/v2/reseller/octo/OctoRouter';
import { RequestLoggerMiddleware } from '../../api/v2/reseller/octo/RequestLoggerMiddleware';
import { AvailabilityCalendarHandler } from '../../api/v2/reseller/octo/availability/AvailabilityCalendarHandler';
import { AvailabilityCheckHandler } from '../../api/v2/reseller/octo/availability/AvailabilityCheckHandler';
import { BookingCancellationHandler } from '../../api/v2/reseller/octo/booking/BookingCancellationHandler';
import { BookingConfirmationHandler } from '../../api/v2/reseller/octo/booking/BookingConfirmationHandler';
import { BookingReservationHandler } from '../../api/v2/reseller/octo/booking/BookingReservationHandler';
import { GetProductHandler } from '../../api/v2/reseller/octo/product/GetProductHandler';
import { GetProductsHandler } from '../../api/v2/reseller/octo/product/GetProductsHandler';
import { GetSupplierHandler } from '../../api/v2/reseller/octo/supplier/GetSupplierHandler';
import { GetScenarioHandler } from '../../api/v2/reseller/scenario/GetScenarioHandler';
import { GetScenariosHandler } from '../../api/v2/reseller/scenario/GetScenariosHandler';
import { CreateSessionHandler } from '../../api/v2/session/CreateSessionHandler';
import { GetSessionHandler } from '../../api/v2/session/GetSessionHandler';
import { GetSessionValidationHistoryHandler } from '../../api/v2/session/GetSessionValidationHistoryHandler';
import { UpdateSessionHandler } from '../../api/v2/session/UpdateSessionHandler';
import { ValidateSessionQuestionsAnswersHandler } from '../../api/v2/session/ValidateSessionQuestionsAnswersHandler';
import { ClearDbCommand } from '../../console/command/ClearDbCommand';
import { MigrateDbCommand } from '../../console/command/MigrateDbCommand';
import config from '../config/config';
import { Migrator } from '../database/Migrator';
import { PostgresDatabase } from '../database/PostgresDatabase';
import { ConsoleLoggerFactory } from '../logger/ConsoleLoggerFactory';
import { SentryExceptionLogger } from '../logger/SentryExceptionLogger';
import { VentrataRequestLogger } from '../logger/request/VentrataRequestLogger';
import { RequestScopedContextProvider } from '../requestContext/RequestScopedContextProvider';
import { PostgresRequestLogRepository } from '../requestLog/PostgresRequestLogRepository';
import { RequestLogService } from '../requestLog/RequestLogService';
import { DummySocketIo } from '../socketio/DummySocketIo';
import { SocketIo } from '../socketio/SocketIo';
import { ValidationController } from '../validation/v1/services/validation/Controller';
import { AvailabilityFacade } from '../validation/v2/facade/availability/AvailabilityFacade';
import { BookingFacade } from '../validation/v2/facade/booking/BookingFacade';
import { ProductFacade } from '../validation/v2/facade/product/ProductFacade';
import { SupplierFacade } from '../validation/v2/facade/supplier/SupplierFacade';
import { InMemoryScenarioRepository } from '../validation/v2/scenario/InMemoryScenarioRepository';
import { ScenarioFacade } from '../validation/v2/scenario/ScenarioFacade';
import { ScenarioService } from '../validation/v2/scenario/ScenarioService';
import { AdvancedScenario } from '../validation/v2/scenario/reseller/AdvancedScenario';
import { BasicScenario } from '../validation/v2/scenario/reseller/BasicScenario';
import { PostgresSessionRepository } from '../validation/v2/session/PostgresSessionRepository';
import { SessionFacade } from '../validation/v2/session/SessionFacade';
import { SessionScenarioProgressProvider } from '../validation/v2/session/SessionScenarioProgressProvider';
import { SessionService } from '../validation/v2/session/SessionService';
import { SessionStepGuard } from '../validation/v2/session/SessionStepGuard';
import { SessionStepQuestionAnswersValidationProcessor } from '../validation/v2/session/SessionStepQuestionAnswersValidationProcessor';
import { SessionStepValidationProcessor } from '../validation/v2/session/SessionStepValidationProcessor';
import { StepDataValidator } from '../validation/v2/step/StepDataValidator';
import { StepQuestionAnswersValidator } from '../validation/v2/step/StepQuestionAnswersValidator';
import { AvailabilityCalendarStep } from '../validation/v2/step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../validation/v2/step/reseller/availability/AvailabilityCheckStep';
import { BookingCancellationStep } from '../validation/v2/step/reseller/booking/BookingCancellationStep';
import { BookingConfirmationStep } from '../validation/v2/step/reseller/booking/BookingConfirmationStep';
import { BookingReservationStep } from '../validation/v2/step/reseller/booking/BookingReservationStep';
import { GetProductStep } from '../validation/v2/step/reseller/product/GetProductStep';
import { GetProductsStep } from '../validation/v2/step/reseller/product/GetProductsStep';
import { GetSupplierStep } from '../validation/v2/step/reseller/supplier/GetSupplierStep';

export const container = new Container();

// Logger
container.bind(ConsoleLoggerFactory);
container.bind({
  provide: 'ExceptionLogger',
  useClass: SentryExceptionLogger,
});

const consoleLoggerFactory: ConsoleLoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

const baseConfig = new BaseConfig({
  environment: config.getEnvironment(),
  productionURL: config.BACKEND_ENDPOINT_URL, // TODO unite in core to just "url"
  stagingURL: config.BACKEND_ENDPOINT_URL, // TODO remove in core
});

container.bind({
  provide: 'OctoBackend',
  useValue: new BackendContainer({ config: baseConfig, logger: consoleLogger }).backend,
});

// Database
container.bind({
  provide: 'Database',
  useClass: PostgresDatabase,
});
container.bind(Migrator);

// Request Context
container.bind(RequestScopedContextProvider);

// Request Log
container.bind({
  provide: 'RequestLogger',
  useClass: VentrataRequestLogger,
});
container.bind({
  provide: 'RequestLogRepository',
  useClass: PostgresRequestLogRepository,
});
container.bind(RequestLogService);

// V1
container.bind(ValidateHandler);

// WebSocket
if (config.getEnvironment() === Environment.TEST) {
  container.bind({
    provide: 'WebSocket',
    useClass: DummySocketIo,
  });
} else {
  container.bind({
    provide: 'WebSocket',
    useClass: SocketIo,
  });
}

// Octo
container.bind(AvailabilityFacade);
container.bind(BookingFacade);
container.bind(ProductFacade);
container.bind(SupplierFacade);

// Session
container.bind(SessionScenarioProgressProvider);
container.bind(SessionFacade);

container.bind({
  provide: 'SessionRepository',
  useClass: PostgresSessionRepository,
});
container.bind(SessionService);
container.bind(SessionStepGuard);
container.bind(SessionStepValidationProcessor);

container.bind(SessionStepQuestionAnswersValidationProcessor);
container.bind(StepQuestionAnswersValidator);

container.bind(AvailabilityCalendarStep);
container.bind(AvailabilityCheckStep);
container.bind(BookingCancellationStep);
container.bind(BookingConfirmationStep);
container.bind(BookingReservationStep);
container.bind(GetProductsStep);
container.bind(GetProductStep);
container.bind(GetSupplierStep);

container.bind(StepDataValidator);

// Scenario
// Session
container.bind(ScenarioFacade);

container.bind({
  provide: 'ScenarioRepository',
  useClass: InMemoryScenarioRepository,
});
container.bind(InMemoryScenarioRepository);
container.bind(ScenarioService);

container.bind(JsonResponseFactory);
container.bind(ErrorResponseFactory);

// API
container.bind(ApiRouter);
container.bind(GetDocsHandler);
container.bind(CreateSessionHandler);
container.bind(GetSessionHandler);
container.bind(GetSessionValidationHistoryHandler);
container.bind(UpdateSessionHandler);
container.bind(ValidateSessionQuestionsAnswersHandler);

// Commands
container.bind({
  provide: 'ClearDbCommand',
  useClass: ClearDbCommand,
});
container.bind(ClearDbCommand);
container.bind({
  provide: 'Command',
  useClass: MigrateDbCommand,
  multi: true,
});
container.bind({
  provide: 'MigrateDbCommand',
  useClass: MigrateDbCommand,
});
container.bind(MigrateDbCommand);

// V1 validator
container.bind(V1Router);
container.bind(ValidationController);

// V2 validator
// Routers
container.bind(V2Router);
container.bind(OctoRouter);
container.bind(ResellerRouter);

container.bind(AuthMiddleware);
container.bind(RequestLoggerMiddleware);

// Handlers
container.bind(GetScenarioHandler);
container.bind(GetSupplierHandler);
container.bind(GetScenariosHandler);
container.bind(GetCapabilitiesHandler);
container.bind(AvailabilityCalendarHandler);
container.bind(AvailabilityCheckHandler);
container.bind(BookingReservationHandler);
container.bind(BookingConfirmationHandler);
container.bind(BookingCancellationHandler);
container.bind(GetProductsHandler);
container.bind(GetProductHandler);

// Reseller Scenarios ResellerScenario
container.bind(AdvancedScenario);
container.bind({
  provide: 'ResellerScenario',
  useClass: AdvancedScenario,
  multi: true,
});
container.bind(BasicScenario);
container.bind({
  provide: 'ResellerScenario',
  useClass: BasicScenario,
  multi: true,
});
