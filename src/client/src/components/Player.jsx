import React from 'react';
import './Player.css';
import Board from './Board';
import NextShapes from './NextShapes';
import Stats from './Stats';
import StartButton from './StartButton';
import LostBanner from './LostBanner';

import { useSelector } from 'react-redux';
import { selectPlayerLost } from '../reducers/player';
import { selectGameStarted } from '../reducers/game';

export default function Player() {
	const playerLost = useSelector(selectPlayerLost);
	const gameStarted = useSelector(selectGameStarted);

	return (
		<div className='player-box'>
			<Board />
			<div className='panel-box'>
				<div className='panel-grid'>
					<NextShapes />
					<Stats />
					<StartButton />
				</div>
			</div>
			{gameStarted && playerLost && <LostBanner />}
		</div>
	);
}
