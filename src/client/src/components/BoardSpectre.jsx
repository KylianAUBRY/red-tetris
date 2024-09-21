import React from 'react';
import './BoardSpectre.css';
import { HEIGHT, SPECTRE_COLOR } from '../../../constants.js';

export default function BoardSpectre({ colHeights }) {
	return (
		<div className='board-spectre-grid'>
			{Array.from({ length: HEIGHT }).map((_, rowIndex) =>
				colHeights.map((colHeight, colIndex) => {
					const cellColor =
						rowIndex >= HEIGHT - colHeight ? SPECTRE_COLOR : null;
					return (
						<div
							key={colIndex}
							className={`board-spectre-cell`}
							style={{ '--cell-color': cellColor }}
						></div>
					);
				})
			)}
		</div>
	);
}
