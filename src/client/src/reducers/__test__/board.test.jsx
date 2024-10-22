import { expect, describe, it } from 'vitest';
import {
	boardSlice,
	setBoard,
	fixPiece,
	clearLine,
	penalityLines,
	selectSize,
} from '../board';
import { getStore, getPiece } from '../../../../store_for_test.js';

describe('Board reducers', () => {
	let initialState = getStore();

	it('should handle setBoard', () => {
		let obj = {
			payload: {
				width: 10,
				height: 10,
				grid: [10, 10],
			},
		};
		boardSlice.reducer(initialState.board, setBoard(obj));
	});
	it('should handle fixPiece', () => {
		let piece = getPiece();
		let newState = boardSlice.reducer(initialState.board, fixPiece(piece));
		expect(newState.grid[3][4]).toBe('cyan');
		expect(newState.grid[4][3]).toBe('cyan');
		expect(newState.grid[4][4]).toBe('cyan');
		expect(newState.grid[4][5]).toBe('cyan');
	});
	it('should handle clearLine', () => {
		let state = getStore().board;
		for (let i = 0; i < 10; i++) {
			state.grid[19][i] = 'cyan';
		}
		let newState = boardSlice.reducer(state, clearLine());
		expect(newState.grid).toStrictEqual(Array(20).fill(Array(10).fill(null)));
	});
	it('should handle penalityLines', () => {
		let obj = {
			line: Array(10).fill('red'),
			count: 2,
		};
		let newState = boardSlice.reducer(initialState.board, penalityLines(obj));
		expect(newState.grid[19]).toStrictEqual(Array(10).fill('red'));
		expect(newState.grid[18]).toStrictEqual(Array(10).fill('red'));
		expect(newState.grid[17]).toStrictEqual(Array(10).fill(null));
	});

	it('should handle selectSize', () => {
		selectSize(initialState);
	});
});
