import { createSlice } from '@reduxjs/toolkit';
import { NEXT_PIECE_COUNT } from '../../../constants';

const initialState = {
	shapes: Array(NEXT_PIECE_COUNT).fill([[null]]),
};

export const nextShapeSlice = createSlice({
	name: 'nextShapes',
	initialState: { ...initialState },
	reducers: {
		setNextShapes: (state, action) => {
			state.shapes = action.payload;
		},
		resetNextShapes: (state) => {
			Object.assign(state, initialState);
		},
	},
});

export const { setNextShapes, resetNextShapes } = nextShapeSlice.actions;

export const selectNextShape = (state) => state.nextShapes.shapes;

export default nextShapeSlice.reducer;
