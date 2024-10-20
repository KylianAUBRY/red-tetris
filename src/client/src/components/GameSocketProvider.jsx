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
	setPlayerReady,
	setPlayerLost,
	updatePlayerStats,
	playerConnection,
	playerDisconnection,
	selectPlayerLost,
} from '../reducers/player';
import {
	startGame,
	endGame,
	addOpponent,
	updateOpponent,
	removeOpponent,
	gameDisconnection,
	spectGame,
} from '../reducers/game';
import useBoxRef from '../hooks/useBoxRef';
import { PROD, PORT, MOVE_DELAY, MOVE_INTERVAL } from '../../../constants';

function setDelayedInterval(callback, delayTimeout, intervalTime, ...args) {
	let timeoutId, intervalId;

	timeoutId = setTimeout(() => {
		intervalId = setInterval(callback, intervalTime, ...args);
	}, delayTimeout);

	return {
		clear() {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		},
	};
}

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
			dispatch(setPlayerLost(false));
			dispatch(startGame());
		});

		socket.on('spect', () => {
			dispatch(spectGame());
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

		socket.on('owner', (value, isNewRoom) => {
			dispatch(setPlayerOwner(value));
		});

		socket.on('ready', (value) => {
			dispatch(setPlayerReady(value));
		});

		socket.on('lost', (value) => {
			dispatch(setPlayerLost(value));
		});

		socket.on('stats', (stats) => {
			dispatch(updatePlayerStats(stats));
		});

		socket.on('penality', (line, count) => {
			dispatch(penalityLines({ line, count }));
		});

		socket.on('end', (last_player) => {
			dispatch(endGame());
			console.log('Game Over');
		});

		socket.on('error', (reason) => {
			console.log('Error:', reason);
		});

		socket.on('addOpponent', (opponent) => {
			dispatch(addOpponent(opponent));
		});

		socket.on('updateOpponent', (opponentUpdate) => {
			dispatch(updateOpponent(opponentUpdate));
		});

		socket.on('removeOpponent', (opponent) => {
			dispatch(removeOpponent(opponent));
		});

		socket.on('disconnect', () => {
			dispatch(playerDisconnection());
			dispatch(gameDisconnection());
			console.log('Disconnected from server');
		});

		let keysInterval = new Map();

		const handleKeyUp = (event) => {
			const interval = keysInterval.get(event.key);
			if (interval) {
				interval.clear();
				keysInterval.delete(event.key);
			}
		};

		const handleKeyDown = (event) => {
			if (!event.repeat) {
				let move;
				if (event.key === 'ArrowLeft') {
					handleKeyUp({ key: 'ArrowRight' });
					move = 'left';
				} else if (event.key === 'ArrowRight') {
					handleKeyUp({ key: 'ArrowLeft' });
					move = 'right';
				} else if (event.key === 'ArrowDown') {
					move = 'down';
				} else if (event.key === 'ArrowUp' && !event.repeat) {
					socket.emit('rotate');
				} else if (event.key === ' ' && !event.repeat) {
					socket.emit('drop');
				}
				if (move) {
					socket.emit('move', move);
					keysInterval.set(
						event.key,
						setDelayedInterval(
							() => socket.emit('move', move),
							MOVE_DELAY,
							MOVE_INTERVAL
						)
					);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		socketRef.current = socket;

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
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
