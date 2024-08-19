import { configureStore } from "@reduxjs/toolkit";
import board from "./reducers/board";
import piece from "./reducers/piece";
import nextPiece from "./reducers/nextPiece";

export default configureStore({
  reducer: {
    board,
    piece,
    nextPiece,
  },
});
