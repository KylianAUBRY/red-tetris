import { createSlice } from '@reduxjs/toolkit';
import { NEXT_PIECE_COUNT } from '../../../constants';

const initialShape = [
	[null, null, null, null],
	[null, null, null, null],
	[null, null, null, null],
	[null, null, null, null],
];

export const nextShapeSlice = createSlice({
	name: 'nextShapes',
	initialState: {
		shapes: Array.from({ length: NEXT_PIECE_COUNT }, () => initialShape),
	},
	reducers: {
		setNextShapes: (state, action) => {
			state.shapes = action.payload;
		},
	},
});

export const { setNextShapes } = nextShapeSlice.actions;

export const selectNextShape = (state) => state.nextShapes.shapes;

export default nextShapeSlice.reducer;
