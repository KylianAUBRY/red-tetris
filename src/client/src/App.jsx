import React, { useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import OpponentsBoard from './components/OpponentsBoards';
import NextShapes from './components/NextShapes';
import StartButton from './components/StartButton';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setBoard, fixPiece, clearLine } from './reducers/board';
import { setPiece, movePiece, rotatePiece, dropPiece } from './reducers/piece';
import { setNextShapes } from './reducers/nextShapes';
import usePieceRef from './hooks/usePieceRef';
import { io } from 'socket.io-client';
import {
	WIDTH,
	HEIGHT,
	PORT,
	PROD,
	BACK_COLOR,
	FRONT_COLOR,
} from '../../constants';

function App() {
	const dispatch = useDispatch();
	const pieceRef = usePieceRef();
	const URL = PROD ? undefined : `http://localhost:${PORT}`;
	const { room, player_name } = useParams();
	const socket = io(URL, {
		auth: { room, player_name },
		autoConnect: false,
	});

	useEffect(() => {
		socket.connect();

		socket.on('connect', function () {
			console.log('Connected to server');
		});

		socket.on('start', function (startBoard, nextShapes, startPiece) {
			dispatch(setBoard(startBoard));
			dispatch(setNextShapes(nextShapes));
			dispatch(setPiece(startPiece));
		});

		socket.on('move', function (direction) {
			dispatch(movePiece(direction));
		});

		socket.on('rotate', function () {
			dispatch(rotatePiece());
		});

		socket.on('drop', function (y) {
			dispatch(dropPiece(y));
		});

		socket.on('new', function (newPiece, nextShapes) {
			dispatch(fixPiece(pieceRef.current));
			dispatch(clearLine());
			dispatch(setNextShapes(nextShapes));
			dispatch(setPiece(newPiece));
		});

		socket.on('end', function () {
			console.log('Game Over');
		});

		const handleKeyDown = (event) => {
			if (event.key === 'ArrowLeft') {
				socket.emit('move', 'left');
			} else if (event.key == 'ArrowRight') {
				socket.emit('move', 'right');
			} else if (event.key == 'ArrowDown') {
				socket.emit('move', 'down');
			} else if (event.key == 'ArrowUp') {
				socket.emit('rotate');
			} else if (event.key == ' ') {
				socket.emit('drop');
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			socket.removeAllListeners();
			socket.disconnect(true);
		};
	}, [room, player_name]);

	function handleStart() {
		socket.emit('start');
	}

	const playerCount = 6;

	const cssVariables = {
		'--width': WIDTH,
		'--height': HEIGHT,
		'--back-color': BACK_COLOR,
		'--front-color': FRONT_COLOR,
	};

	return (
		<div className='game-grid' style={cssVariables}>
			<OpponentsBoard opponentCount={playerCount} />
			<div className='game-box'>
				<div className='game-board-box'>
					<Board />
					<NextShapes />
					<StartButton callback={handleStart} />
				</div>
			</div>
		</div>
	);
}

export default App;
