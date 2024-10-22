import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	msg: null,
};

export const errorSlice = createSlice({
	name: 'error',
	initialState: { ...initialState },
	reducers: {
		setErrorMsg: (state, action) => {
			state.msg = action.payload;
		},
		resetError: (state) => {
			Object.assign(state, initialState);
		},
	},
});

export const { setErrorMsg, resetError } = errorSlice.actions;

export const selectErrorMsg = (state) => state.error.msg;

export default errorSlice.reducer;
