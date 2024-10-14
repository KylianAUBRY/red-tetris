import Board from './Board.js';
import Piece from './Piece.js';
import Rand from './Rand.js';
import {
	WIDTH,
	HEIGHT,
	MAX_DELAY,
	MIN_DELAY,
	ACCELERATION,
	NEXT_PIECE_COUNT,
	PENALITY_COLOR,
	PIECE_COUNT,
	LEVEL_UP,
	SCORE_UNIT,
	DEFAULT_STATS,
	PIECE_I,
	PIECE_O,
	PIECE_T,
	PIECE_J,
	PIECE_L,
	PIECE_S,
	PIECE_Z,
} from '../constants.js';

function factorial(n) {
	let res = 1;

	for (let i = 2; i <= n; i++) res = res * i;
	return res;
}

class Player {
	constructor(name, gameTopic) {
		this.name = name;
		this.socket = null;
		this.connected = false;
		this.owner = false;
		this.ready = false;
		this.lost = true;
		this.stats = { ...DEFAULT_STATS };
		this.delay = MAX_DELAY;
		this.rand = new Rand();
		this.board = new Board(WIDTH, HEIGHT);
		this.piece = null;
		this.nextShapes = new Array();
		this.gameTopic = gameTopic;
		this.gameSubArray = new Array();
		this.initGameTopic();
	}

	gameSub(event, callback) {
		callback = callback.bind(this);
		this.gameTopic.on(event, callback);
		this.gameSubArray.push({ event, callback });
	}

	gameSend(event, ...args) {
		this.gameTopic.emit(event, this.name, ...args);
	}

	on(event, callback) {
		if (this.connected) {
			this.socket.on(event, callback.bind(this));
		}
	}

	emit(event, ...args) {
		if (this.connected) {
			this.socket.emit(event, ...args);
		}
	}

	setOwner(value, isNewRoom = false) {
		if (this.owner !== value) {
			this.owner = value;
			this.emit('owner', value, isNewRoom);
			this.gameSend('owner', value);
			if (this.owner) {
				this.setReady(true);
			}
		}
	}

	setReady(value) {
		if (this.ready !== value) {
			this.ready = value;
			this.emit('ready', value);
			this.gameSend('ready', value);
		}
	}

	setLost(value) {
		if (this.lost !== value) {
			this.lost = value;
			this.emit('lost', value);
			this.gameSend('lost', value);
		}
	}

	updateStats(stats) {
		Object.assign(this.stats, stats);
		this.emit('stats', stats);
		this.gameSend('stats', stats);
	}

	initGameTopic() {
		this.gameSub('start', this.startGame);
		this.gameSub('connect', (player_name, opponent) => {
			if (player_name !== this.name) {
				this.emit('addOpponent', opponent);
			}
		});
		this.gameSub('owner', (player_name, owner) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', { name: player_name, owner });
			}
		});
		this.gameSub('ready', (player_name, ready) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', { name: player_name, ready });
			}
		});
		this.gameSub('lost', (player_name, lost) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', { name: player_name, lost });
			}
		});
		this.gameSub('stats', (player_name, stats) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', { name: player_name, stats });
			}
		});
		this.gameSub('newTurn', (player_name, clearCount, colHeights) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', { name: player_name, colHeights });
				this.penality(clearCount);
			}
		});
		this.gameSub('penality', (player_name, colHeights) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', { name: player_name, colHeights });
			}
		});
		this.gameSub('quit', (player_name) => {
			if (player_name !== this.name) {
				this.emit('removeOpponent', player_name);
			}
		});
		this.gameSub('end', this.endGame);
	}

	clearGameTopic() {
		for (const gameSub of this.gameSubArray) {
			this.gameTopic.off(gameSub.event, gameSub.callback);
		}
		this.gameSubArray.length = 0;
	}

	connection(socket) {
		console.log('Player', this.name, 'trying to connect');
		if (
			this.connected &&
			socket.handshake.auth.sessionid !== this.socket.handshake.auth.sessionid
		) {
			socket.emit('error', 'Already connected');
			return false;
		}
		this.socket = socket;
		this.connected = true;
		this.gameSend('connect', this.toOpponent());
		this.on('disconnect', this.disconnection);
		return true;
	}

	disconnection() {
		if (this.connected) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
			this.connected = false;
			this.gameSend('disconnect');
		}
	}

	startGame(seed) {
		if (this.ready) {
			this.lost = false;
			this.stats = { ...DEFAULT_STATS };
			this.delay = MAX_DELAY;

			this.rand.set(seed);
			this.board.clearGrid();
			this.generateNextShapes();
			this.generateNextShapes();
			this.newPiece();
			this.startGameEvents();
			this.gravity = setInterval(() => {
				this.movePiece('down', false);
			}, this.delay);
		} else {
			this.emit('spect');
		}
	}

	startGameEvents() {
		this.on('move', this.movePiece);
		this.on('rotate', this.rotatePiece);
		this.on('drop', this.dropPiece);
		this.emit(
			'start',
			this.board,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT),
			this.piece
		);
	}

	clearGameEvents() {
		this.socket.removeAllListeners('move');
		this.socket.removeAllListeners('rotate');
		this.socket.removeAllListeners('drop');
	}

	endGame(last_player) {
		this.emit('end', last_player);
		if (!this.owner) {
			this.setReady(false);
		}
	}

	generateNextShapes() {
		let shapesBundle = [
			PIECE_I,
			PIECE_O,
			PIECE_T,
			PIECE_J,
			PIECE_L,
			PIECE_S,
			PIECE_Z,
		];
		this.nextShapes.push(...this.rand.shuf(shapesBundle));
	}

	updateGravity() {
		clearInterval(this.gravity);
		this.gravity = setInterval(() => {
			this.movePiece('down', false);
		}, this.delay);
	}

	newPiece() {
		let newShape = this.nextShapes.shift();
		this.piece = new Piece(newShape, Math.floor((WIDTH - newShape.length) / 2));
		if (this.nextShapes.length <= PIECE_COUNT) {
			this.generateNextShapes();
		}
		while (this.board.pieceCollides(this.piece)) {
			this.piece.y -= 1;
		}
	}

	newTurn() {
		if (this.board.pieceOutOfBounds(this.piece)) {
			this.lose();
			return false;
		}
		this.board.fixPiece(this.piece);
		const clearCount = this.board.clearLine();
		if (clearCount) {
			this.updateStats({
				score:
					this.stats.score +
					SCORE_UNIT * factorial(clearCount) * (this.stats.level + 1),
				lines: this.stats.lines + clearCount,
				level: Math.floor(this.stats.lines / LEVEL_UP),
			});
			this.delay = Math.max(
				MIN_DELAY,
				MAX_DELAY - this.stats.level * ACCELERATION
			);
		}
		this.newPiece();
		if (this.board.pieceTotallyOutOfBounds(this.piece)) {
			this.lose();
			return false;
		}
		this.updateGravity();
		this.emit(
			'newTurn',
			this.piece,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT)
		);
		this.gameSend('newTurn', clearCount, this.board.toColHeights());
		return true;
	}

	movePiece(direction, isPlayer = true) {
		let newPiece = this.piece.clone();

		newPiece.move(direction);
		if (!this.board.pieceCollides(newPiece)) {
			this.piece = newPiece;
			if (isPlayer && direction === 'down') {
				this.updateStats({ score: this.stats.score + 1 });
				this.updateGravity();
				this.gameSend('updateStats', this.stats);
			}
			this.emit('move', direction);
			return true;
		} else if (direction === 'down') {
			this.newTurn();
		}
		return false;
	}

	rotatePiece() {
		let newPiece = this.piece.clone();

		newPiece.rotate(this);
		if (!this.board.pieceCollides(newPiece)) {
			this.piece = newPiece;
			this.emit('rotate');
		}
	}

	dropPiece() {
		let distance = 0;

		this.piece.y += 1;
		while (!this.board.pieceCollides(this.piece)) {
			this.piece.y += 1;
			distance += 1;
		}
		this.piece.y -= 1;
		if (distance) {
			this.updateStats({ score: this.stats.score + distance * 2 });
			this.gameSend('updateStats', this.stats);
		}
		this.emit('drop', this.piece.y);
		this.newTurn();
	}

	penality(clearCount) {
		let count = clearCount - 1;

		if (!this.lost && 0 < count) {
			let line = Array(WIDTH).fill(PENALITY_COLOR);
			line[Math.floor(Math.random() * WIDTH)] = null;

			this.board.addPenalityLines(line, count);
			this.emit('penality', line, count);
			this.gameSend('penality', this.board.toColHeights());
		}
	}

	toOpponent() {
		return {
			name: this.name,
			ready: this.ready,
			lost: this.lost,
			owner: this.owner,
			stats: this.stats,
			colHeights: this.board.toColHeights(),
		};
	}

	lose() {
		this.clearGameEvents();
		clearInterval(this.gravity);
		this.nextShapes = [];
		this.setLost(true);
	}

	quit() {
		this.clearGameEvents();
		clearInterval(this.gravity);
		this.board.clearGrid();
		this.piece = null;
		this.nextShapes = [];
		this.clearGameTopic();
		this.disconnection();
		this.setOwner(false);
		this.setReady(false);
		this.setLost(true);
		this.gameSend('quit');
	}
}

export default Player;
