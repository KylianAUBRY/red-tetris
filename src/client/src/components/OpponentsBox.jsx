import React from 'react';
import './OpponentsBox.css';
import Opponent from './Opponent';

import { useSelector } from 'react-redux';
import { selectOpponents } from '../reducers/game';

export default function OpponentsBox() {
	const opponents = useSelector(selectOpponents);
	return (
		<div className='opponents-box'>
			{Array.from(opponents.values()).map((opponent, index) => (
				<Opponent key={index} opponent={opponent} />
			))}
		</div>
	);
}
