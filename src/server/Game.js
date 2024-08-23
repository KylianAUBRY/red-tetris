import Player from './Player.js';

class Game {
	constructor(room) {
		this.room = room;
		this.players = new Map();
	}

	addPlayer(socket) {
		const player_name = socket.handshake.auth.player_name;
		let player = this.players.get(player_name);
		if (player == undefined) {
			player = new Player(player_name);
			this.players.set(player_name, player);
		}
		player.connection(socket);
	}

	startGame() {
		const seed = Date.now();
		for (let player of this.players.values()) {
			player.startGame(seed);
		}
	}
}

export default Game;
