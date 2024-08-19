class Piece {
	constructor(game, shape, x = 0, y = 0) {
		this.x = x;
		this.y = y;
		this.shape = shape;
	}

	clone() {
		return new Piece(this.game, this.shape, this.x, this.y);
	}

	move(direction) {
		switch (direction) {
			case 'left':
				this.x -= 1;
				break;
			case 'right':
				this.x += 1;
				break;
			case 'down':
				this.y += 1;
				break;
		}
	}

	rotate() {
		const size = this.shape.length;
		this.shape = this.shape.map((row, y) =>
			row.map((_, x) => this.shape[size - x - 1][y])
		);
	}
}

export default Piece;
