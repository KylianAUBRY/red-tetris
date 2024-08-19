import Grid from './Grid.js';
import Piece from './Piece.js';
import {
	WIDTH,
	HEIGHT,
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
	constructor(socket) {
		this.socket = socket;
		this.grid = new Grid(WIDTH, HEIGHT);
		this.pieces = [];
		this.newPieces();
		this.newPieces();
		socket.emit(
			'start',
			this.pieces[0],
			this.pieces.slice(1, 1 + NEXT_PIECE_COUNT).map((piece) => piece.shape)
		);
	}

	newPieces() {
		let piecesBundle = [
			new Piece(this, PIECE_I),
			new Piece(this, PIECE_O),
			new Piece(this, PIECE_T),
			new Piece(this, PIECE_J),
			new Piece(this, PIECE_L),
			new Piece(this, PIECE_S),
			new Piece(this, PIECE_Z),
		];
		for (var i = piecesBundle.length - 1; 0 < i; i--) {
			let randI = Math.floor(Math.random() * (i + 1));
			let tmp = piecesBundle[randI];
			piecesBundle[randI] = piecesBundle[i];
			piecesBundle[i] = tmp;
		}
		this.pieces = this.pieces.concat(piecesBundle);
	}

	fixPiece() {
		this.grid.fixPiece(this.pieces.shift());
		if (this.pieces.length <= PIECE_COUNT) {
			this.newPieces();
		}
		this.socket.emit(
			'new',
			this.pieces[0],
			this.pieces.slice(1, 1 + NEXT_PIECE_COUNT).map((piece) => piece.shape)
		);
	}

	movePiece(direction) {
		let newPiece = this.pieces[0].clone();

		newPiece.move(direction);
		if (this.grid.pieceCollides(newPiece) == false) {
			this.pieces[0] = newPiece;
			this.socket.emit('move', direction);
		} else if (direction === 'down') {
			this.fixPiece();
		}
	}

	rotatePiece() {
		let newPiece = this.pieces[0].clone();

		newPiece.rotate(this);
		if (this.grid.pieceCollides(newPiece) == false) {
			this.pieces[0] = newPiece;
			this.socket.emit('rotate');
		}
	}

	dropPiece() {
		this.pieces[0].y += 1;

		while (this.grid.pieceCollides(this.pieces[0]) == false) {
			this.pieces[0].y += 1;
		}
		this.pieces[0].y -= 1;
		this.socket.emit('drop', this.pieces[0].y);
		this.fixPiece();
	}
}

export default Game;
