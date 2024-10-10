import React from 'react';
import './StartButton.css';

import useSocketRef from '../hooks/useSocketRef';
import { useSelector } from 'react-redux';
import { selectPlayerOwner } from '../reducers/player';
import { selectGameStarted } from '../reducers/game';

export default function StartButton() {
	const socketRef = useSocketRef();
	const playerOwner = useSelector(selectPlayerOwner);
	const gameStarted = useSelector(selectGameStarted);
	let content;

	if (!gameStarted) {
		content = playerOwner ? 'Start Game' : 'Waiting owner';
	} else {
		content = 'Game in progress';
	}

	function startRequest(event) {
		event.target.blur();
		socketRef.current.emit('start');
	}

	return (
		<button
			disabled={!playerOwner || gameStarted}
			className='start-button'
			onClick={startRequest}
		>
			{content}
		</button>
	);
}
