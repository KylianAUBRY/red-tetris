import React from 'react';
import './Player.css';
import Board from './Board';
import NextShapes from './NextShapes';
import Stats from './Stats';
import GameButton from './GameButton';
import LostBanner from './LostBanner';

import { useSelector } from 'react-redux';
import { selectPlayerLost } from '../reducers/player';
import { selectGameStarted, selectPlayerLast } from '../reducers/game';

export default function Player() {
	const gameStarted = useSelector(selectGameStarted);
	const playerLost = useSelector(selectPlayerLost);
	const playerLast = useSelector(selectPlayerLast);

	return (
		<div className='player-box'>
			<Board />
			<div className='panel-box'>
				<div className='panel-grid'>
					<NextShapes />
					<Stats />
					<GameButton />
				</div>
			</div>
			{gameStarted && playerLost && !playerLast && <LostBanner />}
		</div>
	);
}
