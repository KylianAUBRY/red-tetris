import { createSlice } from "@reduxjs/toolkit";

export const pieceSlice = createSlice({
  name: "piece",
  initialState: {
    x: 0,
    y: 0,
    shape: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  },
  reducers: {
    setCoords: (state, action) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    setShape: (state, action) => {
      state.shape = action.payload;
    },
    moveLeft: (state) => {
      state.x -= 1;
    },
    moveRight: (state) => {
      state.x += 1;
    },
    moveDown: (state) => {
      state.y += 1;
    },
  },
});

export const { setCoords, setShape, moveLeft, moveRight, moveDown } =
  pieceSlice.actions;

export const selectPiece = (state) => state.piece;

export default pieceSlice.reducer;
