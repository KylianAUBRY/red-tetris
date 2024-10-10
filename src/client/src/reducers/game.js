import { createSlice } from '@reduxjs/toolkit';
import { WIDTH, START_STATS } from '../../../constants';

export const playerSlice = createSlice({
	name: 'game',
	initialState: {
		started: false,
		opponents: new Array(),
	},
	reducers: {
		startGame: (state) => {
			state.started = true;
			for (let opponent of state.opponents) {
				opponent.colHeights = new Array(WIDTH).fill(0);
				opponent.stats = { ...START_STATS };
			}
		},
		endGame: (state) => {
			state.started = false;
		},
		addOpponent: (state, action) => {
			const opponent = state.opponents.find(
				(opponent) => opponent.name === action.payload.name
			);
			if (opponent) {
				opponent.stats = action.payload.stats;
				opponent.colHeights = action.payload.colHeights;
			} else {
				state.opponents.push(action.payload);
			}
		},
		removeOpponent: (state, action) => {
			state.opponents = state.opponents.filter(
				(opponent) => opponent.name !== action.payload
			);
		},
		updateOpponentBoard: (state, action) => {
			const opponent = state.opponents.find(
				(opponent) => opponent.name === action.payload.name
			);
			if (opponent) {
				opponent.colHeights = action.payload.colHeights;
			}
		},
		updateOpponentStats: (state, action) => {
			const opponent = state.opponents.find(
				(opponent) => opponent.name === action.payload.name
			);
			if (opponent) {
				opponent.stats = action.payload.stats;
			}
		},
		gameDisconnection: (state) => {
			state.started = false;
			state.opponents = new Array();
		},
	},
});

export const {
	startGame,
	endGame,
	addOpponent,
	removeOpponent,
	updateOpponentBoard,
	updateOpponentStats,
	gameDisconnection,
} = playerSlice.actions;

export const selectGame = (state) => state.game;
export const selectGameStarted = (state) => state.game.started;
export const selectOpponents = (state) => state.game.opponents;

export default playerSlice.reducer;
