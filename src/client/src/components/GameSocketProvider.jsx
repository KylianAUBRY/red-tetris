import React, { createContext, useEffect, useMemo, useRef } from 'react';

import { io } from 'socket.io-client';
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
import useBoxRef from '../hooks/useBoxRef';
import { PROD, PORT } from '../../../constants';

export const SocketContext = createContext(null);

export default function GameSocketProvider({ room, player_name, children }) {
	const dispatch = useDispatch();
	const URL = PROD ? undefined : `http://localhost:${PORT}`;
	const sessionid = sessionStorage.getItem('sessionid');
	const pieceRef = useBoxRef(useSelector(selectPiece));
	const playerRef = useBoxRef(useSelector(selectPlayer));
	const socketRef = useRef(null);

	useEffect(() => {
		const socket = io(URL, {
			auth: { room, player_name, sessionid },
			autoConnect: false,
		});

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

		socket.on('host', (isNewRoom) => {
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

		socketRef.current = socket;

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			socket.disconnect();
			socket.removeAllListeners();
		};
	}, [dispatch, URL, room, player_name, sessionid, pieceRef, playerRef]);

	return (
		<SocketContext.Provider value={socketRef}>
			{children}
		</SocketContext.Provider>
	);
}
