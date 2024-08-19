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
		fixPiece: (state, action) => {
			var piece = action.payload;
			piece.shape.forEach((shapeRow, y) => {
				shapeRow.forEach((shapeColor, x) => {
					if (shapeColor) {
						state.grid[piece.y + y][piece.x + x] = shapeColor;
					}
				});
			});
		},
	},
});

export const { setBlock, fixPiece } = boardSlice.actions;

export const selectGrid = (state) => state.board.grid;

export default boardSlice.reducer;
