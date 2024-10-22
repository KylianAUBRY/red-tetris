import { expect, describe, it } from 'vitest';
import Board from '../Board.js';
import { getPiece } from '../../store_for_test.js';

describe('Board server', () => {
	it('call Board', () => {
		new Board(10, 20);
	});

	it('call Board function setCell', () => {
		let board = new Board(10, 20);
		board.setCell(1, 1, 'white');
		expect(board.grid[1][1]).toBe('white');
	});

	it('call Board function fixPiece', () => {
		let piece = getPiece();
		let board = new Board(10, 20);

		board.fixPiece(piece);
		expect(board.grid[3][4]).toBe('cyan');
	});

	it('call Board function pieceCollides', () => {
		let piece = getPiece();
		let board = new Board(10, 20);

		piece.x = -1;
		expect(board.pieceCollides(piece)).toBe(true);
		piece.x = 6;
		expect(board.pieceCollides(piece)).toBe(false);
	});

	it('call Board function pieceOutOfBounds', () => {
		let piece = getPiece();
		let board = new Board(10, 20);

		expect(board.pieceOutOfBounds(piece)).toBe(false);
		piece.x = -1;
		expect(board.pieceOutOfBounds(piece)).toBe(true);
	});

	it('call Board function pieceTotallyOutOfBounds', () => {
		let piece = getPiece();
		let board = new Board(10, 20);

		expect(board.pieceTotallyOutOfBounds(piece)).toBe(false);
		piece.y = -1;
		expect(board.pieceTotallyOutOfBounds(piece)).toBe(false);
		piece.y = -3;
		expect(board.pieceTotallyOutOfBounds(piece)).toBe(true);
	});

	it('call Board function toColHeights', () => {
		let board = new Board(10, 20);
		expect(board.toColHeights()).toStrictEqual(Array(10).fill(0));
		for (let i = 0; i < 10; i++) {
			board.setCell(i, 1, 'white');
		}
		expect(board.toColHeights()).toStrictEqual(Array(10).fill(19));
	});
	it('call Board function clearLine', () => {
		let board = new Board(10, 20);
		for (let i = 0; i < 10; i++) {
			board.setCell(i, 1, 'white');
		}
		board.clearLine();
		expect(board.grid[1]).toStrictEqual(Array(10).fill(null));
	});

	it('call Board function addPenalityLines', () => {
		let board = new Board(10, 20);

		board.addPenalityLines(Array(10).fill('b'), 1);
		expect(board.grid[19]).toStrictEqual(Array(10).fill('b'));
	});

	it('call Board function clearGrid', () => {
		let board = new Board(10, 20);

		board.setCell(1, 1, 'white');
		board.clearGrid();
		expect(board.grid[1][1]).toStrictEqual(null);
	});
});
