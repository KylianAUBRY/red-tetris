import React from 'react';
import './StartButton.css';

import useSocketRef from '../hooks/useSocketRef';

export default function StartButton() {
	const socketRef = useSocketRef();

	function startRequest(event) {
		event.target.blur();
		socketRef.current.emit('start');
	}

	return (
		<button className='start-button' onClick={startRequest}>
			Start Game
		</button>
	);
}
