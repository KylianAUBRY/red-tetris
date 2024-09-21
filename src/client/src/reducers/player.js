import { createSlice } from '@reduxjs/toolkit';

export const playerSlice = createSlice({
	name: 'player',
	initialState: {
		name: null,
		room: null,
		lost: true,
		connected: false,
		host: false,
	},
	reducers: {
		setPlayerName(state, action) {
			state.name = action.payload;
		},
		setPlayerRoom(state, action) {
			state.room = action.payload;
		},
		setPlayerHost(state, action) {
			state.host = action.payload;
		},
		playerStart: (state) => {
			state.lost = false;
		},
		playerLost: (state) => {
			state.lost = true;
		},
		playerConnection: (state) => {
			state.connected = true;
		},
		playerDisconnection: (state) => {
			state.connected = false;
			state.lost = true;
			state.host = false;
		},
	},
});

export const {
	setPlayerName,
	setPlayerRoom,
	setPlayerHost,
	playerStart,
	playerLost,
	playerConnection,
	playerDisconnection,
} = playerSlice.actions;

export const selectPlayer = (state) => state.player;

export default playerSlice.reducer;
