import React, { useEffect, useMemo } from 'react';
import './Game.css';
import GameSocketProvider from '../components/GameSocketProvider';
import Board from '../components/Board';
import OpponentsBoard from '../components/OpponentsBoards';
import NextShapes from '../components/NextShapes';
import StartButton from '../components/StartButton';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setName, setRoom, selectPlayer } from '../reducers/player';

function Game() {
	const dispatch = useDispatch();
	const player = useSelector(selectPlayer);
	const { room, player_name } = useParams();

	useEffect(() => {
		dispatch(setName(player_name));
		dispatch(setRoom(room));
	}, [room, player_name, dispatch]);

	return (
		<GameSocketProvider room={room} player_name={player_name}>
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
		</GameSocketProvider>
	);
}

export default Game;
