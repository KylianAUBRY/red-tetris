import { createSlice } from '@reduxjs/toolkit';
import { WIDTH, HEIGHT, PENALITY_COLOR } from '../../../constants';

export const boardSlice = createSlice({
	name: 'board',
	initialState: {
		width: WIDTH,
		height: HEIGHT,
		grid: Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null)),
	},
	reducers: {
		setBoard: (state, action) => {
			state.width = action.payload.width;
			state.height = action.payload.height;
			state.grid = action.payload.grid;
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
		clearLine: (state) => {
			state.grid.forEach((row, y) => {
				if (row.every((color) => color)) {
					state.grid.splice(y, 1);
					state.grid.unshift(Array(state.width).fill(null));
				}
			});
		},
		penalityLines(state, action) {
			for (let i = 0; i < action.payload.count; i++) {
				if (state.grid[0].every((color) => !color)) {
					state.grid.splice(0, 1);
				}
				state.grid.push(action.payload.line);
			}
		},
	},
});

export const { setBoard, fixPiece, clearLine, penalityLines } =
	boardSlice.actions;

export const selectGrid = (state) => state.board.grid;
export const selectSize = (state) => {
	state.board.width, state.board.height;
};

export default boardSlice.reducer;
