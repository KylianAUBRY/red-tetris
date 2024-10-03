import React from 'react';
import './Stats.css';

import { useSelector } from 'react-redux';
import { selectPlayerStats } from '../reducers/player';

export default function Stats() {
	const stats = useSelector(selectPlayerStats);

	return (
		<dl className='stats-list'>
			{Object.entries(stats).map(([key, value]) => (
				<div key={key} className='stat'>
					<dt>{key}</dt>
					<dd>{value}</dd>
				</div>
			))}
		</dl>
	);
}
