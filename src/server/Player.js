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
	PIECE_COUNT,
	PIECE_I,
	PIECE_O,
	PIECE_T,
	PIECE_J,
	PIECE_L,
	PIECE_S,
	PIECE_Z,
} from '../constants.js';

class Player {
	constructor(name, gameTopic) {
		this.connected = false;
		this.lost = true;
		this.host = false;
		this.socket = null;
		this.name = name;
		this.score = 0;
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
		this.gameSub('connect', (player_name) => {
			if (player_name !== this.name) {
				this.emit('addOpponent', {
					name: player_name,
					score: 0,
					colHeights: Array.from({ length: WIDTH }, () => 0),
				});
			}
		});
		this.gameSub('newTurn', (player_name, opponent) => {
			if (player_name !== this.name) {
				this.emit('updateOpponent', opponent);
			}
		});
		this.gameSub('disconnect', (player_name) => {
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
		this.connected = true;
		this.socket = socket;
		this.gameSend('connect');
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

	toHost(isNewRoom) {
		if (!this.host) {
			this.host = true;
			this.emit('host', isNewRoom);
			console.log('Player', this.name, 'is the host');
		}
	}

	startGame(seed) {
		this.score = 0;
		this.lost = false;
		this.delay = MAX_DELAY;

		this.rand.set(seed);
		this.board.clearGrid();
		this.generateNextShapes();
		this.generateNextShapes();
		this.newPiece();
		this.initEvents();
		this.gravity = setInterval(() => {
			this.movePiece('down');
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
			this.movePiece('down');
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
		this.clearLine();
		this.newPiece();
		if (this.board.pieceTotallyOutOfBounds(this.piece)) {
			this.lose();
			return false;
		}
		this.updateGravity();
		this.gameSend('newTurn', this.toOpponent());
		this.emit(
			'newTurn',
			this.piece,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT)
		);
		return true;
	}

	movePiece(direction) {
		let newPiece = this.piece.clone();

		newPiece.move(direction);
		if (!this.board.pieceCollides(newPiece)) {
			this.piece = newPiece;
			this.emit('move', direction);
		} else if (direction === 'down') {
			this.newTurn();
		}
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
		this.piece.y += 1;
		while (!this.board.pieceCollides(this.piece)) {
			this.piece.y += 1;
		}
		this.piece.y -= 1;
		this.emit('drop', this.piece.y);
		this.newTurn();
	}

	clearLine() {
		const clearCount = this.board.clearLine();

		if (clearCount) {
			this.delay = Math.max(MIN_DELAY, this.delay - ACCELERATION * clearCount);
		}
	}

	toOpponent() {
		return {
			name: this.name,
			score: this.score,
			colHeights: this.board.toColHeights(),
		};
	}

	lose() {
		this.reset();
		this.emit('lost');
		this.gameSend('lost');
	}

	reset() {
		this.clearEvents();
		clearInterval(this.gravity);
		this.lost = true;
		this.board.clearGrid();
		this.piece = null;
		this.nextShapes = [];
	}

	delete() {
		this.reset();
		this.host = false;
		this.clearGameTopic();
		this.disconnection();
	}
}

export default Player;
