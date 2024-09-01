import { Server as SocketServer } from 'socket.io';
import Game from './Game.js';

class Server {
	constructor(server, config) {
		this.io = new SocketServer(server, config);
		this.games = new Map();
		this.io.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket) {
		const room = socket.handshake.auth.room;

		if (!room) {
			socket.emit('error', 'Room not provided');
		} else {
			let game = this.games.get(room);
			if (!game) {
				game = new Game(room, this.topic);
				this.games.set(room, game);
			}
			game.addPlayer(socket);
		}
	}
}

export default Server;
