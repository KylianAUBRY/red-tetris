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
	constructor() {
		this.grid = new Grid(WIDTH, HEIGHT);
		this.newPieces();
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
			var randI = Math.floor(Math.random() * (i + 1));
			this.pieces.slice(randI, 1, this.pieces[i]);
		}
	}

	fixPiece() {
		this.grid.fixPiece(this.pieces.shift());
		if (this.pieces.length === 0) {
			this.newPieces();
		}
	}
}

export default Game;
