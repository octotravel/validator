import 'dotenv/config';
import 'reflect-metadata';
import gracefulShutdown from 'http-graceful-shutdown';
import { Environment } from '@octocloud/core';

import { app } from './app';
import { LoggerFactory } from './common/logger/LoggerFactory';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import { validatorContainer } from './common/di';
import config from './common/config/config';
import { Database } from './common/database/Database';
import { ConsoleLoggerFactory } from './common/logger/ConsoleLoggerFactory';
import { InjectionToken } from 'tsyringe';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './common/socketio/SocketIo';
import { SentryUtil } from './common/util/SentryUtil';

const database: Database = validatorContainer.resolve(Database);
const consoleLoggerFactory: LoggerFactory = validatorContainer.resolve(ConsoleLoggerFactory);
const consoleLogger = consoleLoggerFactory.create('server');
const env = config.getEnvironment();
const port = config.APP_PORT;

SentryUtil.initSentry();

const httpServer = createServer(app.callback());
const options: any = {};
const socketIoServer: socketio.Server = new socketio.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, options);
socketIoServer.on('connection', (socket: socketio.Socket) => {
  socket.on('session', (sessionId: string) => {
    consoleLogger.log(`Client connected to session with id "${sessionId}".`);
    socket.data.sessionId = sessionId;
    socket.join(sessionId);
  });
});

socketIoServer.on('disconnect', (socket: socketio.Socket) => {
  consoleLogger.log(`Client disconnected to session with id "${socket.data.sessionId}".`);
  socket.leave(socket.data.sessionId);
});

const socketIoServerToken: InjectionToken<WebSocket> = 'SocketIoServer';
validatorContainer.registerInstance(socketIoServerToken, socketIoServer);

const server = httpServer.listen(port, () => {
  consoleLogger.log(`Running app on port ${port} on "${env}" env.`);
});

async function shutdownCallback(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(async () => {
      await database.endPool();
      await SentryUtil.endSentry();
      resolve();
    }, 30000);
  });
}

function finalCallback(): void {
  consoleLogger.log('App gracefully shutted down.');
}

gracefulShutdown(server, {
  signals: 'SIGHUP SIGINT SIGTERM',
  development: env === Environment.LOCAL || env === Environment.TEST,
  onShutdown: shutdownCallback,
  finally: finalCallback,
});
