import React, { useEffect } from 'react';
import './Game.css';
import GameSocketProvider from '../components/GameSocketProvider';
import Board from '../components/Board';
import Opponents from '../components/Opponents';
import NextShapes from '../components/NextShapes';
import StartButton from '../components/StartButton';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPlayerName, setPlayerRoom } from '../reducers/player';
import Stats from '../components/Stats';

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
				<div className='game-box'>
					<div className='player-box'>
						<Board />
						<div className='panel-box'>
							<div className='panel-grid'>
								<NextShapes />
								<Stats />
								<StartButton />
							</div>
						</div>
					</div>
				</div>
			</GameSocketProvider>
		</div>
	);
}

export default Game;
