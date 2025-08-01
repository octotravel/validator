import { createServer } from 'node:http';
import { Environment } from '@octocloud/core';
import gracefulShutdown from 'http-graceful-shutdown';
import * as socketio from 'socket.io';
import { app } from './app';
import config from './common/config/config';
import { Database } from './common/database/Database';
import { container } from './common/di/container';
import { ConsoleLoggerFactory } from './common/logger/ConsoleLoggerFactory';
import { LoggerFactory } from './common/logger/LoggerFactory';
import { SentryUtil } from './common/util/SentryUtil';
import { initializeSocketIoServer } from './socketIoServer';

SentryUtil.initSentry();

const database: Database = container.get('Database');
const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create('server');
const env = config.getEnvironment();
const port = config.APP_PORT;

const httpServer = createServer(app.callback());
const socketIoServer: socketio.Server | null = initializeSocketIoServer(httpServer);
const server = httpServer.listen(port, async () => {
  await consoleLogger.log(`Running app on port ${port} on "${env}" env.`);
});

if (env !== Environment.LOCAL && env !== Environment.TEST) {
  gracefulShutdown(server, {
    signals: 'SIGHUP SIGINT SIGTERM',
    development: false,
    onShutdown: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          Promise.resolve()
            .then(() => database.endPool())
            .then(() => SentryUtil.endSentry())
            .then(() => resolve())
            .catch(async (error) => {
              await consoleLogger.error('Error during shutdown:', error);
              resolve();
            });
        }, 30000);
      });
    },
    finally: async () => {
      await consoleLogger.log('App gracefully shutted down.');
    },
  });
}
