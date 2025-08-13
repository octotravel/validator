import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './common/socketio/SocketIo';
import { ValidationResult } from './common/validation/reseller/ValidationResult';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:13000');

socket.connect();
socket.on('validationResult', async (validationResult: ValidationResult): Promise<void> => {
  console.log(validationResult);
});
socket.emit('session', 'd4e7d0ce-8185-4a7b-a6bd-b3d1de4a9fbd');
