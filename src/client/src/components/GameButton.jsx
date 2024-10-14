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

	function getState() {
		if (!playerConnected) {
			return { content: "Can't connect", disabled: true };
		}
		if (gameStarted) {
			return { content: 'Game in progress', disabled: true };
		}
		if (!playerReady) {
			return { content: 'Ready', disabled: false };
		}
		if (!playerOwner) {
			return { content: 'Waiting owner', disabled: true };
		}
		return { content: 'Start Game', disabled: false };
	}

	function readyRequest(event) {
		event.target.blur();
		socketRef.current.emit('ready');
	}

	function startRequest(event) {
		event.target.blur();
		socketRef.current.emit('start');
	}

	const state = getState();

	return (
		<button
			disabled={state.disabled}
			className='game-button'
			onClick={playerReady ? startRequest : readyRequest}
		>
			{state.content}
		</button>
	);
}
