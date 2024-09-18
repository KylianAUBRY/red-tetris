import React from 'react';
import './MiniBoard.css';
import {HEIGHT, SPECTRE_COLOR} from '../../../constants.js'


export default function MiniBoard({ heights }) {
	let array = [5, 4, 3, 1, 6, 10, 15, 4, 0, 1]

	return (
		<div className='mini-board-grid'>
			{Array.from({ length: HEIGHT }).map((_, i) => (
				array.map((value, index) => {
				const pieceCell = i >= (HEIGHT - value) ? SPECTRE_COLOR : null
				return (
					<div 
						key={`${i} - ${index}`}
						className={`mini-board-cell`}
						style={{ '--piece-color': pieceCell}}
					>
					</div>
				)
			})
			))}
		</div>
	);
}
