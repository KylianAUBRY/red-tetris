import { configureStore } from "@reduxjs/toolkit";
import board from "./reducers/board";
import piece from "./reducers/piece";

export default configureStore({
  reducer: {
    board,
    piece,
  },
});
