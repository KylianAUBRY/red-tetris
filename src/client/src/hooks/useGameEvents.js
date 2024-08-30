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

		socket.on('connect', function () {
			console.log('Connected to server');
			dispatch(connection());
		});

		socket.on('start', function (startBoard, nextShapes, startPiece) {
			dispatch(setBoard(startBoard));
			dispatch(setNextShapes(nextShapes));
			dispatch(setPiece(startPiece));
			dispatch(startGame());
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
			if (playerRef.current.inGame) {
				dispatch(fixPiece(pieceRef.current));
				dispatch(clearLine());
				dispatch(setNextShapes(nextShapes));
				dispatch(setPiece(newPiece));
			}
		});

		socket.on('end', function () {
			dispatch(endGame());
			console.log('Game Over');
		});

		socket.on('error', function (reason) {
			console.log('Error:', reason);
		});

		socket.on('disconnect', function () {
			console.log('Disconnected from server');
			dispatch(deconnection());
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
	}, [socket, pieceRef, playerRef, dispatch]);
}

export default useGameEvents;
