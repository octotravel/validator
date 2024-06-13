import 'reflect-metadata';
import gracefulShutdown from 'http-graceful-shutdown';
import { Environment } from '@octocloud/core';

import { LoggerFactory } from './common/logger/LoggerFactory';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import { container } from './common/di/container';
import config from './common/config/config';
import { Database } from './common/database/Database';
import { ConsoleLoggerFactory } from './common/logger/ConsoleLoggerFactory';
import { SentryUtil } from './common/util/SentryUtil';
import { initializeSocketIoServer } from './socketIoServer';
import { app } from './app';

SentryUtil.initSentry();

const database: Database = container.resolve(Database);
const consoleLoggerFactory: LoggerFactory = container.resolve(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create('server');
const env = config.getEnvironment();
const port = config.APP_PORT;

const httpServer = createServer(app.callback());
const socketIoServer: socketio.Server | null = initializeSocketIoServer(httpServer);
const server = httpServer.listen(port, () => {
  consoleLogger.log(`Running app on port ${port} on "${env}" env.`);
});

gracefulShutdown(server, {
  signals: 'SIGHUP SIGINT SIGTERM',
  development: env === Environment.LOCAL || env === Environment.TEST,
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
