import React from 'react';
import './LostBanner.css';

export default function LostBanner() {
	return (
		<div className='lost-banner'>
			<p>
				Game Over<span className='ellipsis-anim'></span>
			</p>
		</div>
	);
}
