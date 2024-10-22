import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_STATS } from '../../../constants';

const initialState = {
	name: null,
	connected: false,
	owner: false,
	ready: false,
	lost: true,
	stats: DEFAULT_STATS,
};

export const playerSlice = createSlice({
	name: 'player',
	initialState: { ...initialState },
	reducers: {
		setPlayerName(state, action) {
			state.name = action.payload;
		},
		setPlayerOwner(state, action) {
			state.owner = action.payload;
		},
		setPlayerReady: (state, action) => {
			state.ready = action.payload;
		},
		setPlayerLost: (state, action) => {
			state.lost = action.payload;
		},
		updatePlayerStats(state, action) {
			Object.assign(state.stats, action.payload);
		},
		playerConnection: (state) => {
			state.connected = true;
		},
		playerDisconnection: (state) => {
			state.connected = false;
		},
		resetPlayer: (state) => {
			Object.assign(state, initialState);
		},
	},
});

export const {
	setPlayerName,
	setPlayerOwner,
	setPlayerReady,
	setPlayerLost,
	updatePlayerStats,
	playerConnection,
	playerDisconnection,
	resetPlayer,
} = playerSlice.actions;

export const selectPlayer = (state) => state.player;
export const selectPlayerOwner = (state) => state.player.owner;
export const selectPlayerReady = (state) => state.player.ready;
export const selectPlayerLost = (state) => state.player.lost;
export const selectPlayerStats = (state) => state.player.stats;
export const selectPlayerConnected = (state) => state.player.connected;

export default playerSlice.reducer;
