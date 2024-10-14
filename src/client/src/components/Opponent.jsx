import React from 'react';
import './Opponent.css';
import BoardSpectre from './BoardSpectre';

import { useSelector } from 'react-redux';
import { selectGameStarted } from '../reducers/game';
import {
	FRONT_COLOR,
	OWNER_COLOR,
	SPECT_COLOR,
	LOST_COLOR,
} from '../../../constants';
import LostBanner from './LostBanner';

export default function Opponent({ opponent }) {
	const gameStarted = useSelector(selectGameStarted);

	function getOutlineColor() {
		if (!opponent.ready) {
			return SPECT_COLOR;
		}
		if (gameStarted && opponent.lost) {
			return LOST_COLOR;
		}
		if (opponent.owner) {
			return OWNER_COLOR;
		}
		return FRONT_COLOR;
	}
	return (
		<div className='opponent' style={{ '--outline-color': getOutlineColor() }}>
			<BoardSpectre colHeights={opponent.colHeights} />
			<div className='opponent-text'>
				{opponent.name} : {opponent.stats.score}
			</div>
		</div>
	);
}
