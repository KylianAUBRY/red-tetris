import React from 'react';
import './NextShapes.css';

import { useSelector } from 'react-redux';
import { selectNextShape } from '../reducers/nextShapes';

function countRow(map) {
	let count = 0;

	for (let i = 0; i < map.length; i++) {
		if (map[i].some((cell) => cell !== null && cell !== '')) count++;
	}
	return count;
}

function collumIsEmpty(map, i) {
	let j = 0;
	while (j < map.length) {
		if (map[j][i] !== null && map[j][i] !== '') break;
		j++;
	}
	if (j < map.length) return false;
	return true;
}

function countColumn(map) {
	let count = 0;

	for (let i = 0; i < map[0].length; i++) {
		if (!collumIsEmpty(map, i)) count++;
	}
	return count;
}

export default function NextShapes() {
	const shapes = useSelector(selectNextShape);
	return (
		<div className='nextShapes-box'>
			{shapes.map((piece, index) => {
				var numberRow = countRow(piece);
				var numberColumn = countColumn(piece);

				return (
					<div
						key={index}
						className='nextShapes-grid'
						style={{
							gridTemplateRows: `repeat(${numberRow}, 25px)`,
							gridTemplateColumns: `repeat(${numberColumn}, 25px)`,
						}}
					>
						{piece.map((row, rowIndex) =>
							row.map((cell, colIndex) => {
								if (
									piece[rowIndex].some(
										(cell) => cell !== null && cell !== ''
									) &&
									!collumIsEmpty(piece, colIndex)
								) {
									return (
										<div
											key={`${rowIndex}-${colIndex}`}
											className={
												cell ? 'nextShapes-cell' : 'nextShapes-empty-cell'
											}
											style={{ '--piece-color': cell }}
										></div>
									);
								}
							})
						)}
					</div>
				);
			})}
		</div>
	);
}
