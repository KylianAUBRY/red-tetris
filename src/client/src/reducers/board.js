import { createSlice } from '@reduxjs/toolkit';
import { WIDTH, HEIGHT } from '../../../constants';

export function pieceCollides(board, piece) {
	return (
		board.height <= piece.y ||
		piece.shape.some((row, y) => {
			return row.some((color, x) => {
				return (
					color &&
					0 <= piece.y + y &&
					(piece.x + x < 0 ||
						board.width <= piece.x + x ||
						board.height <= piece.y + y ||
						board.grid[piece.y + y][piece.x + x])
				);
			});
		})
	);
}

const initialState = {
	width: WIDTH,
	height: HEIGHT,
	grid: Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null)),
};

export const boardSlice = createSlice({
	name: 'board',
	initialState: { ...initialState },
	reducers: {
		setBoard: (state, action) => {
			state.width = action.payload.width;
			state.height = action.payload.height;
			state.grid = action.payload.grid;
		},
		fixPiece: (state, action) => {
			let piece = action.payload;

			while (pieceCollides(state, piece)) {
				piece.y -= 1;
			}
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
				state.grid.splice(0, 1);
				state.grid.push(action.payload.line);
			}
		},
		resetBoard: (state) => {
			Object.assign(state, initialState);
		},
	},
});

export const { setBoard, fixPiece, clearLine, penalityLines, resetBoard } =
	boardSlice.actions;

export const selectBoard = (state) => state.board;
export const selectGrid = (state) => state.board.grid;
export const selectSize = (state) => {
	state.board.width, state.board.height;
};

export default boardSlice.reducer;
