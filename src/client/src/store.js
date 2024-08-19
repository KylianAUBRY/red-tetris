import { configureStore } from "@reduxjs/toolkit";
import board from "./reducers/board";
import piece from "./reducers/piece";
import nextShapes from "./reducers/nextShapes";

export default configureStore({
  reducer: {
    board,
    piece,
    nextShapes,
  },
});
