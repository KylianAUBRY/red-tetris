class Board {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.grid = Array.from({ length: height }, () => Array(width).fill(null));
	}

	setCell(x, y, color) {
		if (0 <= x && x < this.width && 0 <= y && y < this.height) {
			this.grid[y][x] = color;
		}
	}

	fixPiece(piece) {
		piece.shape.forEach((row, y) => {
			row.forEach((color, x) => {
				if (color) {
					this.setCell(piece.x + x, piece.y + y, color);
				}
			});
		});
	}

	pieceCollides(piece) {
		return piece.shape.some((row, y) => {
			return row.some((color, x) => {
				return (
					color &&
					0 <= piece.y + y &&
					(piece.x + x < 0 ||
						this.width <= piece.x + x ||
						this.height <= piece.y + y ||
						this.grid[piece.y + y][piece.x + x])
				);
			});
		});
	}

	pieceOutOfBounds(piece) {
		return piece.shape.some((row, y) => {
			return row.some((color, x) => {
				return (
					color &&
					(piece.x + x < 0 ||
						this.width <= piece.x + x ||
						piece.y + y < 0 ||
						this.height <= piece.y + y)
				);
			});
		});
	}

	pieceTotallyOutOfBounds(piece) {
		return piece.shape.every((row, y) => {
			return row.every((color, x) => {
				return (
					color &&
					(piece.x + x < 0 ||
						this.width <= piece.x + x ||
						piece.y + y < 0 ||
						this.height <= piece.y + y)
				);
			});
		});
	}

	toColHeights() {
		return Array.from({ length: this.width }, (_, colIndex) => {
			const firstBlock = this.grid.findIndex((row) => row[colIndex]);
			return firstBlock !== -1 ? this.height - firstBlock : 0;
		});
	}

	clearLine() {
		return this.grid.reduce((count, row, y) => {
			if (row.every((color) => color)) {
				this.grid.splice(y, 1);
				this.grid.unshift(Array(this.width).fill(null));
				count++;
			}
			return count;
		}, 0);
	}

	clearGrid() {
		this.grid.forEach((row) => row.fill(null));
	}
}

export default Board;
