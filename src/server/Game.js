import EventEmitter from 'node:events';
import Player from './Player.js';

class Game {
	constructor(room) {
		this.room = room;
		this.players = new Map();
		this.gameStarted = false;
		this.topic = new EventEmitter();
		this.setTopic();
	}

	setTopic() {
		this.topic.on('end', (player_name) => {
			if (!this.players.values().some((player) => player.inGame)) {
				this.endGame(player_name);
			}
		});
		this.topic.on('disconnect', (player_name) => {
			if (!this.gameStarted) {
				this.players.get(player_name).delete();
				this.players.delete(player_name);
				if (this.players.size === 0) {
					console.log('Room', this.room, 'is empty');
				} else {
					this.players.values().next().value.emit('host', 1);
				}
			}
		});
	}

	addPlayer(socket) {
		const player_name = socket.handshake.auth.player_name;

		if (!player_name) {
			socket.emit('error', 'Player name not provided');
		} else {
			let player = this.players.get(player_name);
			if (!player) {
				player = new Player(player_name, this.topic);
				this.players.set(player_name, player);
			}
			if (player.connection(socket)) {
				socket.on('start', this.startRequest.bind(this, socket));
				if (this.players.size === 1) {
					socket.emit('host', 0);
				}
				console.log('Player', player_name, 'connected to room', this.room);
			}
		}
	}

	startRequest(socket) {
		if (
			!this.gameStarted &&
			this.players.values().next().value.socket.id === socket.id
		) {
			this.startGame();
		} else {
			socket.emit('error', 'Player not allowed to start game');
		}
	}

	startGame() {
		this.topic.emit('start', Date.now());
		this.gameStarted = true;
	}

	endGame() {
		console.log('Game ended');
		this.players.forEach((player, player_name) => {
			if (!player.connected) {
				player.delete();
				this.players.delete(player_name);
			}
		});
		this.gameStarted = false;
	}

	reset() {
		this.topic.removeAllListeners();
		this.players.forEach((player) => player.delete());
		this.players.clear();
		this.gameStarted = false;
	}
}

export default Game;
