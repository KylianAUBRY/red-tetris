import { configureStore } from '@reduxjs/toolkit';
import board from './reducers/board';
import piece from './reducers/piece';
import nextShapes from './reducers/nextShapes';
import player from './reducers/player';

export default configureStore({
	reducer: {
		board,
		piece,
		nextShapes,
		player,
	},
});
