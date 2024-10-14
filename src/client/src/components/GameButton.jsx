import React from 'react';
import './GameButton.css';

import useSocketRef from '../hooks/useSocketRef';
import { useSelector } from 'react-redux';
import {
	selectPlayerReady,
	selectPlayerConnected,
	selectPlayerOwner,
} from '../reducers/player';
import { selectGameStarted } from '../reducers/game';

export default function GameButton() {
	const socketRef = useSocketRef();
	const playerReady = useSelector(selectPlayerReady);
	const playerConnected = useSelector(selectPlayerConnected);
	const playerOwner = useSelector(selectPlayerOwner);
	const gameStarted = useSelector(selectGameStarted);
	const buttonIsActive =
		playerConnected && (!playerReady || (playerOwner && !gameStarted));

	function getContent() {
		if (!playerConnected) {
			return "Can't connect to server";
		}
		if (gameStarted) {
			return 'Game in progress';
		}
		if (!playerReady) {
			return 'Ready';
		}
		if (!playerOwner) {
			return 'Waiting owner';
		}
		return 'Start Game';
	}

	function readyRequest(event) {
		event.target.blur();
		socketRef.current.emit('ready');
	}

	function startRequest(event) {
		event.target.blur();
		socketRef.current.emit('start');
	}

	return (
		<button
			disabled={!buttonIsActive}
			className='game-button'
			onClick={playerReady ? startRequest : readyRequest}
		>
			{getContent()}
		</button>
	);
}
