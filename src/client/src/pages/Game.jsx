import React, { useEffect } from 'react';
import './Game.css';
import GameSocketProvider from '../components/GameSocketProvider';
import Board from '../components/Board';
import Opponents from '../components/Opponents';
import NextShapes from '../components/NextShapes';
import StartButton from '../components/StartButton';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPlayerName, setPlayerRoom, selectPlayer } from '../reducers/player';
import { selectGame } from '../reducers/game';

function Game() {
	const dispatch = useDispatch();
	const player = useSelector(selectPlayer);
	const game = useSelector(selectGame);
	const { room, player_name } = useParams();

	useEffect(() => {
		dispatch(setPlayerName(player_name));
		dispatch(setPlayerRoom(room));
	}, [room, player_name, dispatch]);

	return (
		<GameSocketProvider room={room} player_name={player_name}>
			<div className='game-grid'>
				<Opponents />
				<div className='game-box'>
					<div className='game-board-box'>
						<Board />
						<NextShapes />
						{player.host && !game.started && <StartButton />}
					</div>
				</div>
			</div>
		</GameSocketProvider>
	);
}

export default Game;
