import Grid from './Grid.js';
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

class Game {
	constructor(socket, seed) {
		this.socket = socket;
		this.rand = new Rand(seed);
		this.grid = new Grid(WIDTH, HEIGHT);
		this.delay = MAX_DELAY;
		this.nextShapes = [];
		this.generateNextShapes();
		this.generateNextShapes();
		this.newPiece();

		this.gravity = setInterval(() => {
			this.movePiece('down');
		}, this.delay);

		socket.on('move', (direction) => {
			this.movePiece(direction);
		});

		socket.on('rotate', () => {
			this.rotatePiece();
		});

		socket.on('drop', () => {
			this.dropPiece();
		});

		socket.on('disconnect', () => {
			this.end();
		});

		socket.emit(
			'start',
			this.piece,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT)
		);
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
		if (this.grid.pieceCollides(this.piece)) {
			this.end();
		}
	}

	fixPiece() {
		this.grid.fixPiece(this.piece);
		this.newPiece();
		this.clearLine();
		this.socket.emit(
			'new',
			this.piece,
			this.nextShapes.slice(0, NEXT_PIECE_COUNT)
		);
	}

	movePiece(direction) {
		let newPiece = this.piece.clone();

		newPiece.move(direction);
		if (this.grid.pieceCollides(newPiece) == false) {
			this.piece = newPiece;
			this.socket.emit('move', direction);
		} else if (direction === 'down') {
			this.fixPiece();
		}
	}

	rotatePiece() {
		let newPiece = this.piece.clone();

		newPiece.rotate(this);
		if (this.grid.pieceCollides(newPiece) == false) {
			this.piece = newPiece;
			this.socket.emit('rotate');
		}
	}

	dropPiece() {
		this.piece.y += 1;
		while (this.grid.pieceCollides(this.piece) == false) {
			this.piece.y += 1;
		}
		this.piece.y -= 1;
		this.socket.emit('drop', this.piece.y);
		this.fixPiece();
	}

	clearLine() {
		let clearCount = this.grid.clearLine();

		clearInterval(this.gravity);
		this.delay = Math.max(MIN_DELAY, this.delay - ACCELERATION * clearCount);
		this.gravity = setInterval(() => {
			this.movePiece('down');
		}, this.delay);
	}

	end() {
		clearInterval(this.gravity);
		this.socket.emit('end');
		this.socket.disconnect();
	}
}

export default Game;
