import { createSlice } from '@reduxjs/toolkit';
import { START_STATS } from '../../../constants';

export const playerSlice = createSlice({
	name: 'player',
	initialState: {
		name: null,
		room: null,
		lost: true,
		connected: false,
		owner: false,
		stats: START_STATS,
	},
	reducers: {
		setPlayerName(state, action) {
			state.name = action.payload;
		},
		setPlayerRoom(state, action) {
			state.room = action.payload;
		},
		setPlayerOwner(state, action) {
			state.owner = action.payload;
		},
		updateStats(state, action) {
			state.stats = action.payload;
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
			state.owner = false;
		},
	},
});

export const {
	setPlayerName,
	setPlayerRoom,
	setPlayerOwner,
	updateStats,
	playerStart,
	playerLost,
	playerConnection,
	playerDisconnection,
} = playerSlice.actions;

export const selectPlayer = (state) => state.player;
export const selectPlayerLost = (state) => state.player.lost;
export const selectPlayerOwner = (state) => state.player.owner;
export const selectPlayerStats = (state) => state.player.stats;

export default playerSlice.reducer;
