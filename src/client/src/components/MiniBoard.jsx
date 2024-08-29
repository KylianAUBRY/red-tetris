import React from 'react';
import './MiniBoard.css';

export default function MiniBoard({ grid, piece }) {
	return (
		<div className='mini-board-grid'>
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					const tmpY = rowIndex - piece.y;
					const tmpX = colIndex - piece.x;
					var pieceCell = null;
					if (
						tmpY >= 0 &&
						tmpX >= 0 &&
						tmpY < piece.shape.length &&
						tmpX < piece.shape.length
					) {
						pieceCell = piece.shape[tmpY][tmpX];
					}
					return (
						<div
							key={`${rowIndex}-${colIndex}`}
							className={`cell`}
							style={{ '--piece-color': pieceCell || cell }}
						>
							{(pieceCell || cell) && <div className='inner-square'></div>}
						</div>
					);
				})
			)}
		</div>
	);
}
