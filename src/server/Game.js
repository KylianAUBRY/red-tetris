import EventEmitter from 'node:events';
import Player from './Player.js';

class Game {
	constructor(room, serverTopic) {
		this.room = room;
		this.players = new Map();
		this.started = false;
		this.topic = new EventEmitter();
		this.serverTopic = serverTopic;
		this.serverSubArray = new Array();
		this.initTopic();
		console.log('Room', this.room, 'created');
	}

	initTopic() {
		this.topic.on('lost', (player_name) => {
			if (this.players.values().every((player) => player.lost)) {
				this.end(player_name);
			}
		});
		this.topic.on('disconnect', (player_name) => {
			if (!this.started) {
				this.removePlayer(player_name);
			}
		});
	}

	serverSub(event, callback) {
		callback = callback.bind(this);
		this.serverTopic.on(event, callback);
		this.serverSubArray.push({ event, callback });
	}

	serverSend(event, ...args) {
		this.serverTopic.emit(event, this.room, ...args);
	}

	clearServerTopic() {
		for (const serverSub of this.serverSubArray) {
			this.serverTopic.off(serverSub.event, serverSub.callback);
		}
		this.serverSubArray.length = 0;
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
				this.players.forEach((player) => {
					if (player.name !== player_name) {
						socket.emit('addOpponent', player.toOpponent());
					}
				});
				if (this.players.size === 1) {
					player.toHost(true);
				}
				console.log('Player', player_name, 'connected to room', this.room);
			}
		}
	}

	removePlayer(player_name) {
		const player = this.players.get(player_name);
		if (player) {
			console.log('Player', player_name, 'disconnected from room', this.room);
			player.delete();
			this.players.delete(player_name);
			if (this.players.size === 0) {
				console.log('Room', this.room, 'is empty');
				this.serverSend('empty', this.room);
			} else {
				this.players.values().next().value.toHost(false);
			}
		}
	}

	startRequest(socket) {
		if (
			!this.started &&
			this.players.values().next().value.socket.id === socket.id
		) {
			this.start();
		} else {
			socket.emit('error', 'Player not allowed to start game');
		}
	}

	start() {
		this.topic.emit('start', Date.now());
		this.started = true;
	}

	end(last_player) {
		console.log('Game ended');
		this.players.forEach((player, player_name) => {
			if (!player.connected) {
				this.removePlayer(player_name);
			}
		});
		this.topic.emit('end', last_player);
		this.started = false;
	}

	reset() {
		this.topic.removeAllListeners();
		this.players.forEach((player) => player.delete());
		this.players.clear();
		this.started = false;
	}

	delete() {
		this.reset();
		this.clearServerTopic();
	}
}

export default Game;
