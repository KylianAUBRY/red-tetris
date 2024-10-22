import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	x: 0,
	y: 0,
	shape: [[null]],
};

export const pieceSlice = createSlice({
	name: 'piece',
	initialState: { ...initialState },
	reducers: {
		setPiece: (state, action) => {
			state.shape = action.payload.shape;
			state.x = action.payload.x;
			state.y = action.payload.y;
		},
		movePiece: (state, action) => {
			if (action.payload === 'left') {
				state.x -= 1;
			} else if (action.payload === 'right') {
				state.x += 1;
			} else if (action.payload === 'down') {
				state.y += 1;
			}
		},
		rotatePiece: (state) => {
			const size = state.shape.length;
			state.shape = state.shape.map((row, y) =>
				row.map((_, x) => state.shape[size - x - 1][y])
			);
		},
		dropPiece: (state, action) => {
			state.y = action.payload;
		},
		resetPiece: (state) => {
			Object.assign(state, initialState);
		},
	},
});

export const { setPiece, movePiece, rotatePiece, dropPiece, resetPiece } =
	pieceSlice.actions;

export const selectPiece = (state) => state.piece;

export default pieceSlice.reducer;
