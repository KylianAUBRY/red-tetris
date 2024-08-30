import { createSlice } from '@reduxjs/toolkit';

export const playerSlice = createSlice({
	name: 'player',
	initialState: {
		name: null,
		room: null,
		inGame: false,
		connected: false,
	},
	reducers: {
		setName(state, action) {
			state.name = action.payload;
		},
		setRoom(state, action) {
			state.room = action.payload;
		},
		startGame: (state) => {
			state.inGame = true;
		},
		endGame: (state) => {
			state.inGame = false;
		},
		connection: (state) => {
			state.connected = true;
		},
		deconnection: (state) => {
			state.connected = false;
		},
	},
});

export const {
	setName,
	setRoom,
	startGame,
	endGame,
	connection,
	deconnection,
} = playerSlice.actions;

export const selectPlayer = (state) => state.player;

export default playerSlice.reducer;