import { createSlice } from '@reduxjs/toolkit';
import { WIDTH, HEIGHT } from '../../../constants';

export const boardSlice = createSlice({
	name: 'board',
	initialState: {
		grid: Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null)),
	},
	reducers: {
		setBlock: (state, action) => {
			state.grid[action.payload.x][action.payload.y] = action.payload.color;
		},
	},
});

export const { setBlock } = boardSlice.actions;

export const selectGrid = (state) => state.board.grid;
export const selectBlock = (state, x, y) => state.board.grid[x][y];

export default boardSlice.reducer;
