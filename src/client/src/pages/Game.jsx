import React, { useEffect } from 'react';
import './Game.css';
import SocketProvider from '../components/SocketProvider';
import Board from '../components/Board';
import OpponentsBoard from '../components/OpponentsBoards';
import NextShapes from '../components/NextShapes';
import StartButton from '../components/StartButton';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setName, setRoom, selectPlayer } from '../reducers/player';
import useGameEvents from '../hooks/useGameEvents';

function Game() {
	const dispatch = useDispatch();
	const player = useSelector(selectPlayer);
	const { room, player_name } = useParams();
	const sessionid = sessionStorage.getItem('sessionid');

	useEffect(() => {
		dispatch(setName(player_name));
		dispatch(setRoom(room));
	}, [room, player_name, dispatch]);

	console.log('Game', room, player_name, sessionid);
	return (
		<SocketProvider
			auth={{ room, player_name, sessionid }}
			socketSetup={useGameEvents}
		>
			<div className='game-grid'>
				<OpponentsBoard opponentCount={6} />
				<div className='game-box'>
					<div className='game-board-box'>
						<Board />
						<NextShapes />
						{player.host && !player.inGame && <StartButton />}
					</div>
				</div>
			</div>
		</SocketProvider>
	);
}

export default Game;
