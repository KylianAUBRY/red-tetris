class Grid {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.grid = Array.from({ length: height }, () => Array(width).fill(null));
	}

	fixPiece(piece) {
		piece.shape.forEach((row, y) => {
			row.forEach((color, x) => {
				if (color) {
					this.grid[piece.y + y][piece.x + x] = color;
				}
			});
		});
	}

	pieceCollides(piece) {
		return piece.shape.some((row, y) => {
			return row.some((color, x) => {
				return (
					color &&
					(piece.x + x < 0 ||
						piece.y + y < 0 ||
						this.width <= piece.x + x ||
						this.height <= piece.y + y ||
						this.grid[piece.y + y][piece.x + x])
				);
			});
		});
	}
}

export default Grid;
