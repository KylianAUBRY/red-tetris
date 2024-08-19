import { createSlice } from '@reduxjs/toolkit';

const initialShape = [
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null],
		[null, null, null, null],
];

export const nextShapeSlice = createSlice({
	name: 'nextShape',
	initialState: {
		shapes: [initialShape, initialShape, initialShape, initialShape],
	},
	reducers: {
		setNextShapes: (state, action) => {
			state = action.payload;
		},
	},
});

export const { setNextShapes } = nextShapeSlice.actions;

export const selectNextShape = (state) => state.nextShapes.shapes;

export default nextShapeSlice.reducer;
