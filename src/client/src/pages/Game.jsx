import React, { useEffect } from 'react';
import './Game.css';
import GameSocketProvider from '../components/GameSocketProvider';
import Opponents from '../components/Opponents';
import Player from '../components/Player';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPlayerName, setPlayerRoom } from '../reducers/player';

function Game() {
	const dispatch = useDispatch();
	const { room, player_name } = useParams();

	useEffect(() => {
		dispatch(setPlayerName(player_name));
		dispatch(setPlayerRoom(room));
	}, [room, player_name, dispatch]);

	return (
		<div className='Game'>
			<GameSocketProvider room={room} player_name={player_name}>
				<Opponents />
				<Player />
				<div className='right-box'></div>
			</GameSocketProvider>
		</div>
	);
}

export default Game;
