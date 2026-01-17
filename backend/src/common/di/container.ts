import { Container } from '@needle-di/core';
import { BackendContainer } from '@octocloud/backend';
import { Environment } from '@octocloud/core';
import { ApiRouter } from '../../api/ApiRouter';
import { ErrorResponseFactory } from '../../api/http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../api/http/json/JsonResponseFactory';
import { GetDocsHandler } from '../../api/reseller/docs/GetResellerDocsHandler';
import { ResellerRouter } from '../../api/reseller/ResellerRouter';
import { GetCapabilitiesHandler } from '../../api/reseller/reseller/capabilities/GetCapabilitiesHandler';
import { AuthMiddleware } from '../../api/reseller/reseller/octo/AuthMiddleware';
import { AvailabilityCalendarHandler } from '../../api/reseller/reseller/octo/availability/AvailabilityCalendarHandler';
import { AvailabilityCheckHandler } from '../../api/reseller/reseller/octo/availability/AvailabilityCheckHandler';
import { BookingCancellationHandler } from '../../api/reseller/reseller/octo/booking/BookingCancellationHandler';
import { BookingConfirmationHandler } from '../../api/reseller/reseller/octo/booking/BookingConfirmationHandler';
import { BookingReservationHandler } from '../../api/reseller/reseller/octo/booking/BookingReservationHandler';
import { OctoRouter } from '../../api/reseller/reseller/octo/OctoRouter';
import { GetProductHandler } from '../../api/reseller/reseller/octo/product/GetProductHandler';
import { GetProductsHandler } from '../../api/reseller/reseller/octo/product/GetProductsHandler';
import { RequestLoggerMiddleware } from '../../api/reseller/reseller/octo/RequestLoggerMiddleware';
import { GetSupplierHandler } from '../../api/reseller/reseller/octo/supplier/GetSupplierHandler';
import { RootResellerRouter } from '../../api/reseller/reseller/RootResellerRouter';
import { GetScenarioHandler } from '../../api/reseller/reseller/scenario/GetScenarioHandler';
import { GetScenariosHandler } from '../../api/reseller/reseller/scenario/GetScenariosHandler';
import { CreateSessionHandler } from '../../api/reseller/session/CreateSessionHandler';
import { GetSessionHandler } from '../../api/reseller/session/GetSessionHandler';
import { GetSessionValidationHistoryHandler } from '../../api/reseller/session/GetSessionValidationHistoryHandler';
import { UpdateSessionHandler } from '../../api/reseller/session/UpdateSessionHandler';
import { ValidateSessionQuestionsAnswersHandler } from '../../api/reseller/session/ValidateSessionQuestionsAnswersHandler';
import { SupplierRouter } from '../../api/supplier/SupplierRouter';
import { ValidateHandler } from '../../api/supplier/validate/ValidateHandler';
import { V1Router } from '../../api/v1/V1Router';
import { V2OctoRouter } from '../../api/v2/V2OctoRouter';
import { V2RootRouter } from '../../api/v2/V2RootRouter';
import { V2Router } from '../../api/v2/V2Router';
import { ClearDbCommand } from '../../console/command/ClearDbCommand';
import { MigrateDbCommand } from '../../console/command/MigrateDbCommand';
import config from '../config/config';
import { Migrator } from '../database/Migrator';
import { PostgresDatabase } from '../database/PostgresDatabase';
import { ConsoleLogger } from '../logger/console/ConsoleLogger';
import { NoopConsoleLogger } from '../logger/console/NoopConsoleLogger';
import { PinoConsoleLogger } from '../logger/console/PinoConsoleLogger';
import { SentryExceptionLogger } from '../logger/exception/SentryExceptionLogger';
import { VentrataRequestLogger } from '../logger/request/VentrataRequestLogger';
import { RequestScopedContextProvider } from '../requestContext/RequestScopedContextProvider';
import { PostgresResellerRequestLogRepository } from '../requestLog/reseller/PostgresResellerRequestLogRepository';
import { ResellerRequestLogService } from '../requestLog/reseller/ResellerRequestLogService';
import { CombinedSupplierRequestLogRepository } from '../requestLog/supplier/CombinedSupplierRequestLogRepository';
import { InMemorySupplierRequestLogRepository } from '../requestLog/supplier/InMemorySupplierRequestLogRepository';
import { PostgresSupplierRequestLogRepository } from '../requestLog/supplier/PostgresSupplierRequestLogRepository';
import { SupplierRequestLogService } from '../requestLog/supplier/SupplierRequestLogService';
import { DummySocketIo } from '../socketio/DummySocketIo';
import { SocketIo } from '../socketio/SocketIo';
import { AvailabilityFacade } from '../validation/reseller/facade/availability/AvailabilityFacade';
import { BookingFacade } from '../validation/reseller/facade/booking/BookingFacade';
import { ProductFacade } from '../validation/reseller/facade/product/ProductFacade';
import { SupplierFacade } from '../validation/reseller/facade/supplier/SupplierFacade';
import { InMemoryScenarioRepository } from '../validation/reseller/scenario/InMemoryScenarioRepository';
import { CoreScenario } from '../validation/reseller/scenario/reseller/CoreScenario';
import { ScenarioFacade } from '../validation/reseller/scenario/ScenarioFacade';
import { ScenarioService } from '../validation/reseller/scenario/ScenarioService';
import { PostgresSessionRepository } from '../validation/reseller/session/PostgresSessionRepository';
import { SessionFacade } from '../validation/reseller/session/SessionFacade';
import { SessionScenarioProgressProvider } from '../validation/reseller/session/SessionScenarioProgressProvider';
import { SessionService } from '../validation/reseller/session/SessionService';
import { SessionStepGuard } from '../validation/reseller/session/SessionStepGuard';
import { SessionStepQuestionAnswersValidationProcessor } from '../validation/reseller/session/SessionStepQuestionAnswersValidationProcessor';
import { SessionStepValidationProcessor } from '../validation/reseller/session/SessionStepValidationProcessor';
import { AvailabilityCalendarStep } from '../validation/reseller/step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../validation/reseller/step/reseller/availability/AvailabilityCheckStep';
import { BookingCancellationStep } from '../validation/reseller/step/reseller/booking/BookingCancellationStep';
import { BookingConfirmationStep } from '../validation/reseller/step/reseller/booking/BookingConfirmationStep';
import { BookingReservationStep } from '../validation/reseller/step/reseller/booking/BookingReservationStep';
import { GetProductStep } from '../validation/reseller/step/reseller/product/GetProductStep';
import { GetProductsStep } from '../validation/reseller/step/reseller/product/GetProductsStep';
import { GetSupplierStep } from '../validation/reseller/step/reseller/supplier/GetSupplierStep';
import { StepDataValidator } from '../validation/reseller/step/StepDataValidator';
import { StepQuestionAnswersValidator } from '../validation/reseller/step/StepQuestionAnswersValidator';
import { ValidationController } from '../validation/supplier/services/validation/Controller';

export const container = new Container();
const env = config.getEnvironment();

if (env === Environment.TEST) {
  container.bind({
    provide: 'ConsoleLogger',
    useClass: NoopConsoleLogger,
  });
} else {
  container.bind({
    provide: 'ConsoleLogger',
    useClass: PinoConsoleLogger,
  });
}

const consoleLogger = container.get<ConsoleLogger>('ConsoleLogger');

// Logger
container.bind({
  provide: 'ExceptionLogger',
  useClass: SentryExceptionLogger,
});

container.bind({
  provide: 'OctoBackend',
  useValue: new BackendContainer({ logger: consoleLogger }).backend,
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
  provide: 'ResellerRequestLogRepository',
  useClass: PostgresResellerRequestLogRepository,
});
container.bind(ResellerRequestLogService);

if (config.getEnvironment() === Environment.TEST || config.getEnvironment() === Environment.LOCAL) {
  container.bind({
    provide: 'InMemorySupplierRequestLogRepository',
    useClass: InMemorySupplierRequestLogRepository,
  });
  container.bind(InMemorySupplierRequestLogRepository);

  container.bind({
    provide: 'PostgresSupplierRequestLogRepository',
    useClass: PostgresSupplierRequestLogRepository,
  });
  container.bind(PostgresSupplierRequestLogRepository);

  container.bind({
    provide: 'SupplierRequestLogRepository',
    useFactory: (context) => {
      const memoryRepo = context.get(InMemorySupplierRequestLogRepository);
      const postgresRepo = context.get(PostgresSupplierRequestLogRepository);
      return new CombinedSupplierRequestLogRepository(memoryRepo, postgresRepo);
    },
  });
  container.bind(CombinedSupplierRequestLogRepository);
} else {
  container.bind({
    provide: 'SupplierRequestLogRepository',
    useClass: PostgresSupplierRequestLogRepository,
  });
}
container.bind(SupplierRequestLogService);

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
container.bind(SupplierRouter);
container.bind(ValidationController);

// V2 validator
// Routers
container.bind(V2Router);
container.bind(V2RootRouter);
container.bind(V2OctoRouter);
container.bind(OctoRouter);
container.bind(ResellerRouter);
container.bind(RootResellerRouter);

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
container.bind(CoreScenario);
container.bind({
  provide: 'ResellerScenario',
  useClass: CoreScenario,
  multi: true,
});
/*
container.bind(BasicScenario);
container.bind({
  provide: 'ResellerScenario',
  useClass: BasicScenario,
  multi: true,
});*/
