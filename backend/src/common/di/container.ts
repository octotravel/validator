import { Container, InjectionToken } from '@needle-di/core';
import { BackendContainer } from '@octocloud/backend';
import { Backend, BaseConfig, Environment } from '@octocloud/core';
import { AnsibleDecryptCommand } from '../../console/command/AnsibleDecryptCommand';
import { AnsibleEncryptCommand } from '../../console/command/AnsibleEncryptCommand';
import { ClearDbCommand } from '../../console/command/ClearDbCommand';
import { Command } from '../../console/command/Command';
import { MigrateDbCommand } from '../../console/command/MigrateDbCommand';
import config from '../config/config';
import { ConsoleLoggerFactory } from '../logger/ConsoleLoggerFactory';
import { ExceptionLogger } from '../logger/ExceptionLogger';
import { SentryExceptionLogger } from '../logger/SentryExceptionLogger';
import { RequestLogger } from '../logger/request/RequestLogger';
import { VentrataRequestLogger } from '../logger/request/VentrataRequestLogger';
import { PostgresRequestLogRepository } from '../requestLog/PostgresRequestLogRepository';
import { RequestLogRepository } from '../requestLog/RequestLogRepository';
import { DummySocketIo } from '../socketio/DummySocketIo';
import { SocketIo } from '../socketio/SocketIo';
import { InMemoryScenarioRepository } from '../validation/v2/scenario/InMemoryScenarioRepository';
import { Scenario } from '../validation/v2/scenario/Scenario';
import { ScenarioRepository } from '../validation/v2/scenario/ScenarioRepository';
import { AdvancedScenario } from '../validation/v2/scenario/reseller/AdvancedScenario';
import { BasicScenario } from '../validation/v2/scenario/reseller/BasicScenario';
import { PostgresSessionRepository } from '../validation/v2/session/PostgresSessionRepository';
import { SessionRepository } from '../validation/v2/session/SessionRepository';
import { Database } from '../database/Database';

export const container = new Container();

const consoleLoggerFactory: ConsoleLoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create();

const baseConfig = new BaseConfig({
  environment: config.getEnvironment(),
  productionURL: config.BACKEND_ENDPOINT_URL, // TODO unite in core to just "url"
  stagingURL: config.BACKEND_ENDPOINT_URL, // TODO remove in core
});

export const OCTO_BACKEND = new InjectionToken<Backend>('OCTO_BACKEND');
export const EXCEPTION_LOGGER = new InjectionToken<ExceptionLogger>('EXCEPTION_LOGGER');
export const REQUEST_LOGGER = new InjectionToken<RequestLogger>('REQUEST_LOGGER');
export const REQUEST_LOG_REPOSITORY = new InjectionToken<RequestLogRepository>('REQUEST_LOGGER');

container.bind({
  provide: OCTO_BACKEND,
  useValue: new BackendContainer({ config: baseConfig, logger: consoleLogger }).backend,
});

container.bind({
  provide: EXCEPTION_LOGGER,
  useValue: new SentryExceptionLogger(),
});

container.bind({
  provide: REQUEST_LOGGER,
  useClass: VentrataRequestLogger,
});

container.bind({
  provide: 'RequestLogRepository',
  useClass: PostgresRequestLogRepository,
});

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

export const SESSION_REPOSITORY = new InjectionToken<SessionRepository>('SESSION_REPOSITORY');

container.bind({
  provide: SESSION_REPOSITORY,
  useClass: PostgresSessionRepository,
});

export const SCENARIO_REPOSITORY = new InjectionToken<ScenarioRepository>('SCENARIO_REPOSITORY');

container.bind({
  provide: SCENARIO_REPOSITORY,
  useClass: InMemoryScenarioRepository,
});

export const COMMAND = new InjectionToken<Command>('COMMAND');

container.bind({
  provide: COMMAND,
  useClass: AnsibleDecryptCommand,
  multi: true,
});
container.bind({
  provide: COMMAND,
  useClass: AnsibleEncryptCommand,
  multi: true,
});
container.bind({
  provide: COMMAND,
  useClass: ClearDbCommand,
  multi: true,
});
container.bind({
  provide: COMMAND,
  useClass: MigrateDbCommand,
  multi: true,
});

export const RESELLER_SCENARIO = new InjectionToken<Scenario>('RESELLER_SCENARIO');

container.bind({
  provide: RESELLER_SCENARIO,
  useClass: AdvancedScenario,
  multi: true,
});
container.bind({
  provide: RESELLER_SCENARIO,
  useClass: BasicScenario,
  multi: true,
});
