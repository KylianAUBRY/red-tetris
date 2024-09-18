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
		this.socket = null;
		this.name = name;
		this.delay = MAX_DELAY;
		this.rand = new Rand();
		this.board = new Board(WIDTH, HEIGHT);
		this.piece = null;
		this.nextShapes = new Array();
		this.gameTopic = gameTopic;
		this.subList = new Array();
		this.subGameTopic();
	}

	sub(event, callback) {
		callback = callback.bind(this);
		this.gameTopic.on(event, callback);
		this.subList.push({ event, callback });
	}

	send(event, ...args) {
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

	subGameTopic() {
		this.sub('start', this.startGame);
	}

	unsubGameTopic() {
		for (const sub of this.subList) {
			this.gameTopic.off(sub.event, sub.callback);
		}
		this.subList.length = 0;
	}

	setGameEvent() {
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

	clearGameEvent() {
		this.socket.removeAllListeners('move');
		this.socket.removeAllListeners('rotate');
		this.socket.removeAllListeners('drop');
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
			this.setGameEvent();
		}
		return true;
	}

	deconnection() {
		if (this.connected) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
			this.connected = false;
			this.send('disconnect');
			console.log('Player', this.name, 'disconnected');
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
			this.setGameEvent();
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

	fixPiece() {
		if (this.board.pieceOutOfBounds(this.piece)) {
			this.endGame();
		} else {
			this.board.fixPiece(this.piece);
			this.newPiece();
			this.clearLine();
			this.emit('new', this.piece, this.nextShapes.slice(0, NEXT_PIECE_COUNT));
		}
	}

	movePiece(direction) {
		let newPiece = this.piece.clone();

		newPiece.move(direction);
		if (!this.board.pieceCollides(newPiece)) {
			this.piece = newPiece;
			this.emit('move', direction);
		} else if (direction === 'down') {
			this.fixPiece();
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
		this.fixPiece();
	}

	clearLine() {
		const clearCount = this.board.clearLine();

		if (clearCount) {
			clearInterval(this.gravity);
			this.delay = Math.max(MIN_DELAY, this.delay - ACCELERATION * clearCount);
			this.gravity = setInterval(() => {
				this.movePiece('down');
			}, this.delay);
		}
	}

	endGame() {
		this.reset();
		this.send('end');
		this.emit('end');
	}

	reset() {
		clearInterval(this.gravity);
		this.inGame = false;
		this.board.clearGrid();
		this.piece = null;
		this.nextShapes = [];
	}

	delete() {
		this.reset();
		this.unsubGameTopic();
		this.deconnection();
	}
}

export default Player;
