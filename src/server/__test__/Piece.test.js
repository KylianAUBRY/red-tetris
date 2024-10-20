import {expect, describe, beforeEach, it} from 'vitest';
import Piece from '../Piece.js'
import { getPiece } from '../../store_for_test.js';


describe('Piece Component', () => {

	it('call Piece', () => {
		let piece = new Piece(10, 20);
	});
});