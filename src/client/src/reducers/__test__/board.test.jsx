import {expect, describe, beforeEach, it} from 'vitest';
import { boardSlice, setBoard, fixPiece, clearLine, penalityLines } from '../board'
import { getStore, getPiece } from "../../../../store_for_test.js"

describe('Board reducers', () => {

	let initialState = getStore().board;

	it('should handle setBoard', () => {
		let obj = {payload: {
			width: 10,
			height: 10,
			grid: [10, 10]
		}}
		boardSlice.reducer(initialState, setBoard(obj))
	});
	// it('should handle fixPiece', () => {
	// 	let piece = getPiece();
	// 	let obj = {
	// 		payload : piece
	// 	}
	// 	console.log(obj.payload.piece)
	// 	boardSlice.reducer(initialState, fixPiece(obj))
	// });
	

});