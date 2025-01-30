import { Environment } from '@octocloud/core';
import gracefulShutdown from 'http-graceful-shutdown';

import { createServer } from 'node:http';
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

const database: Database = container.get(Database);
const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create('server');
const env = config.getEnvironment();
const port = config.APP_PORT;

const httpServer = createServer(app.callback());
const socketIoServer: socketio.Server | null = initializeSocketIoServer(httpServer);
const server = httpServer.listen(port, () => {
  consoleLogger.log(`Running app on port ${port} on "${env}" env.`);
});

if (env !== Environment.LOCAL && env !== Environment.TEST) {
  gracefulShutdown(server, {
    signals: 'SIGHUP SIGINT SIGTERM',
    development: false,
    onShutdown: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await database.endPool();
          await SentryUtil.endSentry();
          resolve();
        }, 30000);
      });
    },
    finally: () => {
      consoleLogger.log('App gracefully shutted down.');
    },
  });
}
