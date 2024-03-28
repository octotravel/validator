import { io } from 'socket.io-client';

export abstract class Socketio {
	public static openSocket = (sessionId: string) => {
		const socket = io('http://localhost:13000');
		socket.connect();
		socket.emit('session', sessionId);
		return socket;
	};
}
