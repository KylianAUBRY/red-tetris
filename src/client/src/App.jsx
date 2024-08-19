import { ShowBoard } from './components/Board';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fixPiece } from './reducers/board';
import { setPiece, movePiece } from './reducers/piece';
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

		socket.on('start', function (startPiece) {
			dispatch(setPiece(startPiece));
		});

		socket.on('move', function (direction) {
			console.log('move', direction);
			dispatch(movePiece(direction));
		});

		socket.on('new', function (newPiece) {
			dispatch(fixPiece(pieceRef.current));
			dispatch(setPiece(newPiece));
		});

		const handleKeyDown = (event) => {
			if (event.key === 'ArrowLeft') {
				socket.emit('move', 'left');
			} else if (event.key == 'ArrowRight') {
				socket.emit('move', 'right');
			} else if (event.key == 'ArrowDown') {
				socket.emit('move', 'down');
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			socket.removeAllListeners();
			socket.disconnect();
		};
	}, []);

	return (
		<div>
			<ShowBoard />
		</div>
	);
}

export default App;
