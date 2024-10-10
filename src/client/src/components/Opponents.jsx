import React from 'react';
import './Opponents.css';
import BoardSpectre from './BoardSpectre';

import { useSelector } from 'react-redux';
import { selectOpponents } from '../reducers/game';

export default function Opponents() {
	const opponents = useSelector(selectOpponents);
	return (
		<div className='opponents-box'>
			{Array.from(opponents.values()).map((opponent, index) => (
				<BoardSpectre
					key={index}
					colHeights={opponent.colHeights}
					name={opponent.name}
					score={opponent.stats.score}
				/>
			))}
		</div>
	);
}
