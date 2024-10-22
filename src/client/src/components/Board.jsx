import React from 'react';
import './Board.css';

import { useSelector } from 'react-redux';
import { pieceCollides, selectBoard } from '../reducers/board';
import { selectPiece } from '../reducers/piece';

function getGhost(board, piece) {
	const ghost = { ...piece };
	while (!pieceCollides(board, ghost)) {
		ghost.y++;
	}
	ghost.y--;
	return ghost;
}

function getCell(piece, x, y) {
	if (y < 0 || x < 0 || y >= piece.shape.length || x >= piece.shape[0].length) {
		return null;
	}
	return piece.shape[y][x];
}

function getDivCell(cell, pieceCell, ghostCell) {
	if (pieceCell) {
		return {
			color: pieceCell,
			className: 'board-cell piece-cell',
		};
	} else if (ghostCell) {
		return {
			color: ghostCell,
			className: 'board-cell ghost-cell',
		};
	} else {
		return {
			color: cell,
			className: 'board-cell',
		};
	}
}

export default function Board() {
	const board = useSelector(selectBoard);
	const piece = useSelector(selectPiece);
	let ghost = getGhost(board, piece);

	return (
		<div className='board-grid'>
			{board.grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					const pieceCell = getCell(
						piece,
						colIndex - piece.x,
						rowIndex - piece.y
					);
					const ghostCell = getCell(
						ghost,
						colIndex - ghost.x,
						rowIndex - ghost.y
					);
					const divCell = getDivCell(cell, pieceCell, ghostCell);
					return (
						<div
							key={`${rowIndex}-${colIndex}`}
							className={divCell.className}
							style={{ '--cell-color': divCell.color }}
						></div>
					);
				})
			)}
		</div>
	);
}
