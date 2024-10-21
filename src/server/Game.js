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
		this.topic.on('lost', (player_name, lost) => {
			if (lost && this.players.values().every((player) => player.lost)) {
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
			let player =
				this.players.get(player_name) || new Player(player_name, this.topic);
			if (player.connection(socket)) {
				socket.on('start', this.startRequest.bind(this, player));
				socket.on('ready', this.readyRequest.bind(this, player));
				for (const player of this.players.values()) {
					if (player.name !== player_name) {
						socket.emit('addOpponent', player.toOpponent());
					}
				}
				if (this.players.size === 0) {
					player.setOwner(true, true);
				}
				if (this.started) {
					if (player.ready) {
						player.startGameEvents();
					} else {
						player.emit('spect');
					}
				}
				this.players.set(player_name, player);
				console.log('Player', player_name, 'connected to room', this.room);
			}
		}
	}

	removePlayer(player_name) {
		const player = this.players.get(player_name);
		if (player) {
			console.log('Player', player_name, 'disconnected from room', this.room);
			player.quit();
			this.players.delete(player_name);
			if (this.players.size === 0) {
				console.log('Room', this.room, 'is empty');
				this.serverSend('empty', this.room);
			} else {
				this.players.values().next().value.setOwner(true, false);
			}
		}
	}

	startRequest(player) {
		if (
			!this.started &&
			this.players.values().next().value.name === player.name
		) {
			this.start();
		} else {
			player.emit('error', 'Player not allowed to start game');
		}
	}

	readyRequest(player) {
		if (!this.started) {
			player.setReady(true);
		} else {
			player.emit('error', 'Game already started');
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

	delete() {
		this.topic.removeAllListeners();
		this.players.forEach((player) => player.quit());
		this.players.clear();
		this.started = false;
		this.clearServerTopic();
	}
}

export default Game;
