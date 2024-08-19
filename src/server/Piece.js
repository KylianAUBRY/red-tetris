class Piece {
	constructor(game, shape, x = 0, y = 0) {
		this.x = x;
		this.y = y;
		this.shape = shape;
	}

	rotate(game) {
		const size = this.shape.length;
		const newShape = this.shape.map((row, y) =>
			row.map((_, x) => this.shape[size - x - 1][y])
		);
		if (game.grid.pieceCollides({ ...this, shape: newShape })) {
			return false;
		} else {
			this.shape = newShape;
			return true;
		}
	}

	move(game, direction) {
		const newCoord = { x: this.x, y: this.y };

		if (direction === 'left') {
			newCoord.x -= 1;
		} else if (direction === 'right') {
			newCoord.x += 1;
		} else if (direction === 'down') {
			newCoord.y += 1;
		}
		if (game.grid.pieceCollides({ ...this, ...newCoord })) {
			if (direction === 'down') {
				game.fixPiece(this);
			}
			return false;
		} else {
			this.x = newCoord.x;
			this.y = newCoord.y;
			return true;
		}
	}
}

export default Piece;
