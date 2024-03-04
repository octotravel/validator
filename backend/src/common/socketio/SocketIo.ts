import * as socketio from 'socket.io';
import { singleton } from 'tsyringe';
import { validatorContainer } from '../di';
import { WebSocket } from './WebSocket';

@singleton()
export class SocketIo implements WebSocket {
  private socketIoServer: socketio.Server | null = null;

  public async emit(sessionId: string, data: any): Promise<void> {
    const emit = this.getSocketIoServer().emit(sessionId, data);
    console.log(emit);
  }

  private getSocketIoServer(): socketio.Server {
    if (this.socketIoServer === null) {
      const socketIoServer: socketio.Server = validatorContainer.resolve('SocketIoServer');

      socketIoServer.on('connection', (socket: socketio.Socket) => {
        console.log('SOCKET IO');
      });

      this.socketIoServer = socketIoServer;
    }

    return this.socketIoServer;
  }
}
