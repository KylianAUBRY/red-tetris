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
	START_STATS,
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
		this.connected = false;
		this.lost = true;
		this.owner = false;
		this.socket = null;
		this.name = name;
		this.stats = { ...START_STATS };
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

	initGameTopic() {
		this.gameSub('start', this.startGame);
		this.gameSub('connect', (player_name, stats, colHeights) => {
			if (player_name !== this.name) {
				console.log('addOpponent', player_name, 'to', this.name);
				this.emit('addOpponent', player_name, stats, colHeights);
			}
		});
		this.gameSub('newTurn', (player_name, clearCount, colHeights) => {
			if (player_name !== this.name) {
				this.emit('updateOpponentBoard', player_name, colHeights);
				this.penality(clearCount);
			}
		});
		this.gameSub('updateStats', (player_name, stats) => {
			if (player_name !== this.name) {
				this.emit('updateOpponentStats', player_name, stats);
			} else {
				this.emit('updateStats', stats);
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
		this.gameSend('connect', this.stats, this.board.toColHeights());
		this.on('disconnect', this.disconnection);
		if (!this.lost) {
			this.initEvents();
		}
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

	initEvents() {
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

	clearEvents() {
		this.socket.removeAllListeners('move');
		this.socket.removeAllListeners('rotate');
		this.socket.removeAllListeners('drop');
	}

	toOwner(isNewRoom) {
		if (!this.owner) {
			this.owner = true;
			this.emit('owner', isNewRoom);
			console.log('Player', this.name, 'is the owner');
		}
	}

	startGame(seed) {
		this.stats = { ...START_STATS };
		this.lost = false;
		this.delay = MAX_DELAY;

		this.rand.set(seed);
		this.board.clearGrid();
		this.generateNextShapes();
		this.generateNextShapes();
		this.newPiece();
		this.initEvents();
		this.gravity = setInterval(() => {
			this.movePiece('down', false);
		}, this.delay);
	}

	endGame(last_player) {
		this.emit('end', last_player);
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
			this.stats.score +=
				SCORE_UNIT * factorial(clearCount) * (this.stats.level + 1);
			this.stats.lines += clearCount;
			this.stats.level = Math.floor(this.stats.lines / LEVEL_UP);
			this.delay = Math.max(
				MIN_DELAY,
				MAX_DELAY - this.stats.level * ACCELERATION
			);
			this.gameSend('updateStats', this.stats);
		}
		this.newPiece();
		if (this.board.pieceTotallyOutOfBounds(this.piece)) {
			this.lose();
			return false;
		}
		this.updateGravity();
		this.gameSend('newTurn', clearCount, this.board.toColHeights());
		this.emit(
			'newTurn',
			this.piece,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT)
		);
		return true;
	}

	movePiece(direction, isPlayer = true) {
		let newPiece = this.piece.clone();

		newPiece.move(direction);
		if (!this.board.pieceCollides(newPiece)) {
			this.piece = newPiece;
			if (isPlayer && direction === 'down') {
				this.stats.score += 1;
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
			this.stats.score += distance * 2;
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
		}
	}

	lose() {
		this.clearEvents();
		clearInterval(this.gravity);
		this.lost = true;
		this.nextShapes = [];
		this.emit('lost');
		this.gameSend('lost');
	}

	quit() {
		this.clearEvents();
		clearInterval(this.gravity);
		this.lost = true;
		this.board.clearGrid();
		this.piece = null;
		this.nextShapes = [];
		this.owner = false;
		this.clearGameTopic();
		this.disconnection();
		this.gameSend('quit');
	}
}

export default Player;
