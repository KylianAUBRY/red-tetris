import { createSlice } from '@reduxjs/toolkit';

const initialPiece = {
	shape: [
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null],
	],
};

export const nextPieceSlice = createSlice({
	name: 'nextPiece',
	initialState: {
		pieces: [initialPiece, initialPiece, initialPiece, initialPiece],
	},
	reducers: {
		setNextShape: (state, action) => {
			state.pieces = action.payload;
		},
	},
});

export const { setNextShape } = nextPieceSlice.actions;

export const selectNextPiece = (state, index) => state.nextPiece.pieces[index];

export default nextPieceSlice.reducer;
