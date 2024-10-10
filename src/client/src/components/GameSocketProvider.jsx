import React, { createContext, useEffect, useRef } from 'react';

import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
	setBoard,
	fixPiece,
	clearLine,
	penalityLines,
} from '../reducers/board';
import {
	setPiece,
	movePiece,
	rotatePiece,
	dropPiece,
	selectPiece,
} from '../reducers/piece';
import { setNextShapes } from '../reducers/nextShapes';
import {
	setPlayerOwner,
	updateStats,
	playerStart,
	playerLost,
	playerConnection,
	playerDisconnection,
	selectPlayerLost,
} from '../reducers/player';
import {
	startGame,
	endGame,
	addOpponent,
	removeOpponent,
	updateOpponentBoard,
	updateOpponentStats,
	gameDisconnection,
} from '../reducers/game';
import useBoxRef from '../hooks/useBoxRef';
import { PROD, PORT } from '../../../constants';

export const SocketContext = createContext(null);

export default function GameSocketProvider({ room, player_name, children }) {
	const dispatch = useDispatch();
	const URL = PROD ? undefined : `http://localhost:${PORT}`;
	const sessionid = sessionStorage.getItem('sessionid');
	const pieceRef = useBoxRef(useSelector(selectPiece));
	const playerLostRef = useBoxRef(useSelector(selectPlayerLost));
	const socketRef = useRef(null);

	useEffect(() => {
		const socket = io(URL, {
			auth: { room, player_name, sessionid },
			autoConnect: false,
		});

		socket.connect();

		socket.on('connect', () => {
			dispatch(playerConnection());
			console.log('Connected to server');
		});

		socket.on('newSession', (sessionid) => {
			sessionStorage.setItem('sessionid', sessionid);
		});

		socket.on('start', (startBoard, nextShapes, startPiece) => {
			dispatch(setBoard(startBoard));
			dispatch(setNextShapes(nextShapes));
			dispatch(setPiece(startPiece));
			dispatch(playerStart());
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

		socket.on('newTurn', (newPiece, nextShapes) => {
			if (!playerLostRef.current) {
				dispatch(fixPiece(pieceRef.current));
				dispatch(clearLine());
				dispatch(setNextShapes(nextShapes));
				dispatch(setPiece(newPiece));
			}
		});

		socket.on('owner', (isNewRoom) => {
			dispatch(setPlayerOwner(true));
		});

		socket.on('updateStats', (stats) => {
			dispatch(updateStats(stats));
		});

		socket.on('lost', () => {
			dispatch(playerLost());
			console.log('Lost');
		});

		socket.on('penality', (line, count) => {
			dispatch(penalityLines({ line, count }));
		});

		socket.on('end', (last_player) => {
			dispatch(endGame());
			console.log('Game Over');
			console.log('Last:', last_player);
		});

		socket.on('error', (reason) => {
			console.log('Error:', reason);
		});

		socket.on('addOpponent', (name, stats, colHeights) => {
			dispatch(addOpponent({ name, stats, colHeights }));
		});

		socket.on('updateOpponentBoard', (name, colHeights) => {
			dispatch(updateOpponentBoard({ name, colHeights }));
		});

		socket.on('updateOpponentStats', (name, stats) => {
			dispatch(updateOpponentStats({ name, stats }));
		});

		socket.on('removeOpponent', (opponent) => {
			dispatch(removeOpponent(opponent));
		});

		socket.on('disconnect', () => {
			dispatch(playerDisconnection());
			dispatch(gameDisconnection());
			console.log('Disconnected from server');
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
	}, [dispatch, URL, room, player_name, sessionid, pieceRef, playerLostRef]);

	return (
		<SocketContext.Provider value={socketRef}>
			{children}
		</SocketContext.Provider>
	);
}
