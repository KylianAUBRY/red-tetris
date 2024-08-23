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
	constructor(name) {
		this.connected = false;
		this.inGame = false;
		this.socket = null;
		this.name = name;
		this.rand = new Rand();
		this.board = new Board(WIDTH, HEIGHT);
		this.delay = MAX_DELAY;
		this.nextShapes = [];
	}

	connection(socket) {
		if (this.connected) {
			socket.emit('error', 'Already connected');
			return false;
		}
		this.connected = true;
		this.socket = socket;
		if (this.inGame) {
			this.gameEvent();
		}
		this.socket.on('disconnect', () => {
			this.socket.removeAllListeners();
			this.connected = false;
		});
	}

	startGame(seed) {
		this.inGame = true;
		this.delay = MAX_DELAY;

		this.rand.set(seed);
		this.board.clearGrid();
		this.generateNextShapes();
		this.generateNextShapes();
		this.newPiece();
		this.gameEvent();
	}

	gameEvent() {
		if (this.connected) {
			this.gravity = setInterval(() => {
				this.movePiece('down');
			}, this.delay);

			this.socket.on('move', (direction) => {
				this.movePiece(direction);
			});

			this.socket.on('rotate', () => {
				this.rotatePiece();
			});

			this.socket.on('drop', () => {
				this.dropPiece();
			});
		}
		this.emit(
			'start',
			this.board,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT),
			this.piece
		);
	}

	emit(event, ...args) {
		if (this.connected) {
			this.socket.emit(event, ...args);
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
		if (this.board.pieceCollides(this.piece)) {
			this.endGame();
		}
	}

	fixPiece() {
		this.board.fixPiece(this.piece);
		this.newPiece();
		this.clearLine();
		this.emit('new', this.piece, this.nextShapes.slice(0, NEXT_PIECE_COUNT));
	}

	movePiece(direction) {
		let newPiece = this.piece.clone();

		newPiece.move(direction);
		if (this.board.pieceCollides(newPiece) == false) {
			this.piece = newPiece;
			this.emit('move', direction);
		} else if (direction === 'down') {
			this.fixPiece();
		}
	}

	rotatePiece() {
		let newPiece = this.piece.clone();

		newPiece.rotate(this);
		if (this.board.pieceCollides(newPiece) == false) {
			this.piece = newPiece;
			this.emit('rotate');
		}
	}

	dropPiece() {
		this.piece.y += 1;
		while (this.board.pieceCollides(this.piece) == false) {
			this.piece.y += 1;
		}
		this.piece.y -= 1;
		this.emit('drop', this.piece.y);
		this.fixPiece();
	}

	clearLine() {
		let clearCount = this.board.clearLine();

		clearInterval(this.gravity);
		this.delay = Math.max(MIN_DELAY, this.delay - ACCELERATION * clearCount);
		this.gravity = setInterval(() => {
			this.movePiece('down');
		}, this.delay);
	}

	endGame() {
		this.socket.removeAllListeners();
		this.inGame = false;
		this.emit('end');
	}
}

export default Player;
