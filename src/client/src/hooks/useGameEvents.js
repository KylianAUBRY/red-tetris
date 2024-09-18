import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBoard, fixPiece, clearLine } from '../reducers/board';
import {
	setPiece,
	movePiece,
	rotatePiece,
	dropPiece,
	selectPiece,
} from '../reducers/piece';
import { setNextShapes } from '../reducers/nextShapes';
import {
	setHost,
	startGame,
	endGame,
	connection,
	deconnection,
	selectPlayer,
} from '../reducers/player';
import useBoxRef from './useBoxRef';

function useGameEvents(socket) {
	const dispatch = useDispatch();
	const pieceRef = useBoxRef(useSelector(selectPiece));
	const playerRef = useBoxRef(useSelector(selectPlayer));

	useEffect(() => {
		socket.connect();

		socket.on('connect', () => {
			console.log('Connected to server');
			dispatch(connection());
		});

		socket.on('newSession', (sessionid) => {
			sessionStorage.setItem('sessionid', sessionid);
		});

		socket.on('start', (startBoard, nextShapes, startPiece) => {
			dispatch(setBoard(startBoard));
			dispatch(setNextShapes(nextShapes));
			dispatch(setPiece(startPiece));
			dispatch(startGame());
		});

		socket.on('move', (direction) => {
			dispatch(movePiece(direction));
		});

		socket.on('rotate', () => {
			dispatch(rotatePiece());
		});

		socket.on('drop', (y) => {
			dispatch(dropPiece(y));
		});

		socket.on('new', (newPiece, nextShapes) => {
			if (playerRef.current.inGame) {
				dispatch(fixPiece(pieceRef.current));
				dispatch(clearLine());
				dispatch(setNextShapes(nextShapes));
				dispatch(setPiece(newPiece));
			}
		});

		socket.on('host', () => {
			dispatch(setHost(true));
		});

		socket.on('end', () => {
			dispatch(endGame());
			console.log('Game Over');
		});

		socket.on('error', (reason) => {
			console.log('Error:', reason);
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
			dispatch(deconnection());
		});

		const handleKeyDown = (event) => {
			if (event.key === 'ArrowLeft') {
				socket.emit('move', 'left');
			} else if (event.key === 'ArrowRight') {
				socket.emit('move', 'right');
			} else if (event.key === 'ArrowDown') {
				socket.emit('move', 'down');
			} else if (event.key === 'ArrowUp') {
				socket.emit('rotate');
			} else if (event.key === ' ') {
				socket.emit('drop');
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			socket.removeAllListeners();
			socket.disconnect();
		};
	}, [dispatch, socket, pieceRef, playerRef]);
}

export default useGameEvents;
