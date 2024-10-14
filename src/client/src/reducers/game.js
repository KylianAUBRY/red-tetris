import { createSlice } from '@reduxjs/toolkit';
import { START_OPPONENT } from '../../../constants';

function findOpponent(opponents, name) {
	return opponents.find((opponent) => opponent.name === name);
}

export const playerSlice = createSlice({
	name: 'game',
	initialState: {
		room: null,
		started: false,
		opponents: new Array(),
	},
	reducers: {
		startGame: (state) => {
			state.started = true;
			for (let opponent of state.opponents) {
				Object.assign(opponent, START_OPPONENT);
			}
		},
		spectGame: (state) => {
			state.started = true;
			for (let opponent of state.opponents) {
				Object.assign(opponent, START_OPPONENT);
			}
		},
		endGame: (state) => {
			state.started = false;
		},
		setRoom(state, action) {
			state.room = action.payload;
		},
		addOpponent: (state, action) => {
			const opponent = findOpponent(state.opponents, action.payload.name);
			if (opponent) {
				Object.assign(opponent, action.payload);
			} else {
				state.opponents.push(action.payload);
			}
		},
		removeOpponent: (state, action) => {
			state.opponents = state.opponents.filter(
				(opponent) => opponent.name !== action.payload
			);
		},
		updateOpponent: (state, action) => {
			const opponent = findOpponent(state.opponents, action.payload.name);
			if (opponent) {
				Object.assign(opponent.stats, action.payload.stats);
				Object.assign(opponent, action.payload);
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
	spectGame,
	endGame,
	setRoom,
	addOpponent,
	removeOpponent,
	updateOpponent,
	gameDisconnection,
} = playerSlice.actions;

export const selectGame = (state) => state.game;
export const selectGameStarted = (state) => state.game.started;
export const selectOpponents = (state) => state.game.opponents;
export const selectPlayerLast = (state) => {
	return state.game.opponents.every(
		(opponent) => opponent.lost || !opponent.ready
	);
};

export default playerSlice.reducer;
