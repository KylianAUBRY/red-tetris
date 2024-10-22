import React from 'react';
import './App.css';
import Game from './pages/Game';
import Home from './pages/Home';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
	WIDTH,
	HEIGHT,
	NEXT_PIECE_COUNT,
	FONT_COLOR,
	BACK_COLOR,
	BOARD_COLOR,
	FRONT_COLOR,
	LOST_COLOR,
} from '../../constants';

function App() {
	const cssVariables = {
		'--width': WIDTH,
		'--height': HEIGHT,
		'--next-piece-count': NEXT_PIECE_COUNT,
		'--font-color': FONT_COLOR,
		'--back-color': BACK_COLOR,
		'--board-color': BOARD_COLOR,
		'--front-color': FRONT_COLOR,
		'--lost-color': LOST_COLOR,
	};

	return (
		<div className='App' style={cssVariables}>
			<BrowserRouter>
				<Routes>
					<Route path='/:room/:player_name' element={<Game />} />
					<Route path='*' element={<Home/>} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
