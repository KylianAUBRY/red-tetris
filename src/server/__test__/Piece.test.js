import { expect, describe, it } from 'vitest';
import Piece from '../Piece.js';
import { getPiece } from '../../store_for_test.js';

describe('Piece server', () => {
	it('call Piece', () => {
		new Piece(getPiece().shape, 1, 1);
	});

	it('call Piece function clone', () => {
		let piece = new Piece(10, 20);
		expect(piece.clone()).toStrictEqual(piece);
	});

	it('call Piece function move', () => {
		let piece = new Piece(getPiece().shape, 1, 1);
		let tmpX = piece.x;
		piece.move('left');
		expect(piece.x).toBe(tmpX - 1);
		tmpX = piece.x;
		piece.move('right');
		expect(piece.x).toBe(tmpX + 1);
		let tmpY = piece.y;
		piece.move('down');
		expect(piece.y).toBe(tmpY + 1);
	});

	it('call Piece function rotate', () => {
		let piece = new Piece(getPiece().shape, 1, 1);
		let tmpShape = [
			[null, 'cyan', null],
			[null, 'cyan', 'cyan'],
			[null, 'cyan', null],
		];
		piece.rotate();
		expect(piece.shape).toStrictEqual(tmpShape);
	});
});
