import React from 'react';
import './StartButton.css';

import useSocket from '../hooks/useSocket';

export default function StartButton() {
	const socket = useSocket();

	function startRequest() {
		socket.emit('start');
	}

	return (
		<button className='start-button' onClick={startRequest}>
			Start Game
		</button>
	);
}
