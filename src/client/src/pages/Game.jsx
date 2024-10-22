import React, { useEffect } from 'react';
import './Game.css';
import GameSocketProvider from '../components/GameSocketProvider';
import OpponentsBox from '../components/OpponentsBox';
import Player from '../components/Player';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { resetBoard } from '../reducers/board';
import { resetError } from '../reducers/error';
import { resetGame } from '../reducers/game';
import { resetNextShapes } from '../reducers/nextShapes';
import { resetPiece } from '../reducers/piece';
import { setPlayerName, resetPlayer } from '../reducers/player';
import { setRoom } from '../reducers/game';

export default function Game() {
	const dispatch = useDispatch();
	const { room, player_name } = useParams();

	useEffect(() => {
		dispatch(resetBoard());
		dispatch(resetError());
		dispatch(resetGame());
		dispatch(resetNextShapes());
		dispatch(resetPiece());
		dispatch(resetPlayer());
	}, [dispatch]);

	useEffect(() => {
		dispatch(setPlayerName(player_name));
		dispatch(setRoom(room));
	}, [room, player_name, dispatch]);

	return (
		<div className='Game'>
			<GameSocketProvider room={room} player_name={player_name}>
				<OpponentsBox />
				<Player />
				<div className='right-box'></div>
			</GameSocketProvider>
		</div>
	);
}
