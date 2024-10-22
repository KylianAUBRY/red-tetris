import { configureStore } from '@reduxjs/toolkit';
import board from './reducers/board';
import piece from './reducers/piece';
import nextShapes from './reducers/nextShapes';
import player from './reducers/player';
import game from './reducers/game';
import error from './reducers/error';

export default configureStore({
	reducer: {
		board,
		piece,
		nextShapes,
		player,
		game,
		error,
	},
});
