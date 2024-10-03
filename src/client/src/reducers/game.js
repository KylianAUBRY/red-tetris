import { createSlice } from '@reduxjs/toolkit';

export const playerSlice = createSlice({
	name: 'game',
	initialState: {
		started: false,
		opponents: new Array(),
	},
	reducers: {
		startGame: (state) => {
			state.started = true;
		},
		endGame: (state) => {
			state.started = false;
		},
		addOpponent: (state, action) => {
			state.opponents.push(action.payload);
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

export default playerSlice.reducer;
