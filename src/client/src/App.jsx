import { ShowBoard } from './components/Board';
import { MiniTetrisContainer } from './components/MiniTetrisContainer';
import { NextPiece } from './components/NextPiece';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fixPiece } from './reducers/board';
import { setPiece, movePiece, rotatePiece, dropPiece } from './reducers/piece';
import { setNextShapes } from './reducers/nextShapes';

import usePieceRef from './hooks/usePieceRef';
import { io } from 'socket.io-client';
import { PORT, PROD } from '../../constants';

function App() {
	const URL = PROD ? undefined : `http://localhost:${PORT}`;
	const socket = io(URL, { autoConnect: false });
	const pieceRef = usePieceRef();
	const dispatch = useDispatch();

	useEffect(() => {
		socket.connect();

		socket.on('connect', function () {
			console.log('Connected to server');
		});

		socket.on('start', function (startPiece, nextPieces) {
			dispatch(setPiece(startPiece));
			dispatch(setNextShapes(nextPieces));
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

		socket.on('new', function (newPiece, nextPieces) {
			dispatch(fixPiece(pieceRef.current));
			dispatch(setNextShapes(nextPieces));
			dispatch(setPiece(newPiece));
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
			socket.disconnect();
		};
	}, []);

	const playerCount = 3;

	return (
		<div className='game-box'>
			<MiniTetrisContainer playerCount={playerCount} />
			<div className='main-game-box'>
				<div className="board-container">
					<ShowBoard />
					<NextPiece />
				</div>
				</div>
		</div>
	);
}

export default App;
