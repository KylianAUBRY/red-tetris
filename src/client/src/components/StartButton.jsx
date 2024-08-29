import React from 'react';
import './StartButton.css';

export default function StartButton({ callback }) {
	return (
		<button className='start-button' onClick={callback}>
			Start Game
		</button>
	);
}
