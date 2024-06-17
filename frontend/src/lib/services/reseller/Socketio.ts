import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';
import { io } from 'socket.io-client';

export abstract class Socketio {
	public static openSocket = (sessionId: string) => {
		const socket = io(PUBLIC_VALIDATOR_BASE_URL);
		socket.connect();
		socket.emit('session', sessionId);
		return socket;
	};
}
