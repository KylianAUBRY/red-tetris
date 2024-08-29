import React from 'react';
import './OpponentsBoards.css';
import MiniBoard from './MiniBoard';

import { useSelector } from 'react-redux';
import { selectGrid } from '../reducers/board';
import { selectPiece } from '../reducers/piece';

export default function Opponents({ opponentCount }) {
	const grid = useSelector(selectGrid);
	const piece = useSelector(selectPiece);

	return (
		<div className='opponents-box'>
			{Array.from({ length: opponentCount }).map((_, index) => (
				<MiniBoard key={index} grid={grid} piece={piece} />
			))}
		</div>
	);
}
