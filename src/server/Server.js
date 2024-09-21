import { Server as SocketServer } from 'socket.io';
import EventEmitter from 'node:events';
import Game from './Game.js';

class Server {
	constructor(server, config) {
		this.io = new SocketServer(server, config);
		this.games = new Map();
		this.topic = new EventEmitter();
		this.io.on('connection', this.onConnection.bind(this));
		this.initTopic();
	}

	initTopic() {
		this.topic.on('empty', (room) => {
			this.removeGame(room);
		});
	}

	newSession(socket) {
		const sessionid = crypto.randomUUID();
		socket.emit('newSession', sessionid);
		socket.handshake.auth.sessionid = sessionid;
	}

	onConnection(socket) {
		const room = socket.handshake.auth.room;
		const sessionid = socket.handshake.auth.sessionid;

		if (!sessionid) {
			this.newSession(socket);
		}
		if (!room) {
			socket.emit('error', 'Room not provided');
		} else {
			let game = this.games.get(room, this.topic);
			if (!game) {
				game = new Game(room, this.topic);
				this.games.set(room, game);
			}
			game.addPlayer(socket);
		}
	}

	removeGame(room) {
		const game = this.games.get(room);
		if (game) {
			game.delete();
			this.games.delete(room);
		}
	}
}

export default Server;
