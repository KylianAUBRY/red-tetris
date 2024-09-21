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
		this.inGame = false;
		this.host = false;
		this.socket = null;
		this.name = name;
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
		this.on('disconnect', this.deconnection);
		if (this.inGame) {
			this.initEvents();
		}
		return true;
	}

	deconnection() {
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
		if (this.connected) {
			this.inGame = true;
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
			this.endGame();
			return false;
		}
		this.board.fixPiece(this.piece);
		this.clearLine();
		this.newPiece();
		if (this.board.pieceTotallyOutOfBounds(this.piece)) {
			this.endGame();
			return false;
		}
		this.updateGravity();
		this.emit('new', this.piece, this.nextShapes.slice(0, NEXT_PIECE_COUNT));
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

	endGame() {
		this.reset();
		this.gameSend('end');
		this.emit('end');
	}

	reset() {
		this.clearEvents();
		clearInterval(this.gravity);
		this.inGame = false;
		this.board.clearGrid();
		this.piece = null;
		this.nextShapes = [];
	}

	delete() {
		this.reset();
		this.host = false;
		this.clearGameTopic();
		this.deconnection();
	}
}

export default Player;
