import Grid from './Grid.js';
import Piece from './Piece.js';
import {
	WIDTH,
	HEIGHT,
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
		this.newPieces();
		socket.emit('start', this.pieces[0]);
	}

	newPieces() {
		this.pieces = [
			new Piece(this, PIECE_I),
			new Piece(this, PIECE_O),
			new Piece(this, PIECE_T),
			new Piece(this, PIECE_J),
			new Piece(this, PIECE_L),
			new Piece(this, PIECE_S),
			new Piece(this, PIECE_Z),
		];
		for (var i = this.pieces.length - 1; 0 < i; i--) {
			let randI = Math.floor(Math.random() * (i + 1));
			let tmp = this.pieces[randI];
			this.pieces[randI] = this.pieces[i];
			this.pieces[i] = tmp;
		}
	}

	fixPiece() {
		this.grid.fixPiece(this.pieces.shift());
		if (this.pieces.length === 0) {
			this.newPieces();
		}
		this.socket.emit('new', this.pieces[0]);
	}
}

export default Game;
