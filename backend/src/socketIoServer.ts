import 'dotenv/config';
import { Server } from 'node:http';
import * as socketio from 'socket.io';
import { container } from './common/di/container';
import { ConsoleLoggerFactory } from './common/logger/ConsoleLoggerFactory';
import { LoggerFactory } from './common/logger/LoggerFactory';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './common/socketio/SocketIo';

export function initializeSocketIoServer(httpServer: Server): socketio.Server | null {
  const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
  const consoleLogger = consoleLoggerFactory.create('socketIoServer');
  const options: Partial<socketio.ServerOptions> = { cors: { origin: '*' } };
  const socketIoServer: socketio.Server = new socketio.Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, options);

  socketIoServer.on('connection', (socket: socketio.Socket) => {
    socket.on('session', async (sessionId: string) => {
      await consoleLogger.log(`Client connected to session with id "${sessionId}".`);
      socket.data.sessionId = sessionId;
      socket.join(sessionId);
    });
  });

  socketIoServer.on('disconnect', async (socket: socketio.Socket) => {
    await consoleLogger.log(`Client disconnected to session with id "${socket.data.sessionId}".`);
    socket.leave(socket.data.sessionId);
  });

  container.bind({
    provide: 'SocketIoServer',
    useValue: socketIoServer,
  });

  return socketIoServer;
}
