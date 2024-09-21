import React from 'react';
import './Opponents.css';
import BoardSpectre from './BoardSpectre';

import { useSelector } from 'react-redux';
import { selectGame } from '../reducers/game';

export default function Opponents() {
	const game = useSelector(selectGame);

	return (
		<div className='opponents-box'>
			{Array.from(game.opponents.values()).map((opponent, index) => (
				<BoardSpectre key={index} colHeights={opponent.colHeights} />
			))}
		</div>
	);
}
