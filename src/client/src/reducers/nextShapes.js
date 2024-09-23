import { createSlice } from '@reduxjs/toolkit';
import { NEXT_PIECE_COUNT } from '../../../constants';

export const nextShapeSlice = createSlice({
	name: 'nextShapes',
	initialState: {
		shapes: Array(NEXT_PIECE_COUNT).fill([[null]]),
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
