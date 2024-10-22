import { expect, describe, beforeEach, it } from 'vitest';
import Board from '../Board.jsx';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HEIGHT, WIDTH } from '../../../../constants.js';
import { getStore } from '../../../../store_for_test.js';

const mockStore = configureStore([]);

describe('Board Component', () => {
	let store;
	const initialState = getStore();

	beforeEach(() => {
		store = mockStore(initialState);
	});

	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Board />
			</Provider>
		);
	});

	it('renders without crashing', () => {
		let state = initialState;
		state.board.grid[0][1] = 'yellow';
		state.board.grid[0][2] = 'orange';
		state.board.grid[0][3] = 'green';
		state.board.grid[0][4] = 'purple';
		state.board.grid[0][5] = 'cyan';
		state.board.grid[0][6] = '#424242';
		state.board.grid[0][7] = null;

		store = mockStore(state);

		render(
			<Provider store={store}>
				<Board />
			</Provider>
		);
	});

	it('renders the correct number of cells based on grid size', () => {
		const { container } = render(
			<Provider store={store}>
				<Board />
			</Provider>
		);

		const cells = container.getElementsByClassName('board-cell');
		expect(cells.length).toBe(HEIGHT * WIDTH);
	});

	it('renders cells the correct color when the transparent piece overlaps', () => {
		let state = initialState;
		state.board.grid = Array.from({ length: HEIGHT }, () =>
			Array(WIDTH).fill('red')
		);
		state.piece = {
			shape: [
				[null, null, null],
				[null, null, null],
				[null, null, null],
			],
			x: 0,
			y: 0,
		};

		store = mockStore(state);
		const { container } = render(
			<Provider store={store}>
				<Board />
			</Provider>
		);
		const cells = container.getElementsByClassName('board-cell');
		for (let i = 0; i < cells.length; i++) {
			expect(cells[i].style.getPropertyValue('--cell-color')).toBe('red');
		}
	});

	it('renders cells the correct color when the piece overlaps', () => {
		let state = initialState;
		state.board.grid = Array.from({ length: HEIGHT }, () =>
			Array(WIDTH).fill('red')
		);
		state.piece = {
			shape: [
				['blue', 'blue', 'blue'],
				[null, null, 'blue'],
				[null, null, 'blue'],
			],
			x: 0,
			y: 0,
		};

		store = mockStore(state);
		const { container } = render(
			<Provider store={store}>
				<Board />
			</Provider>
		);
		const cells = container.getElementsByClassName('board-cell');
		for (let i = 0; i < cells.length; i++) {
			if (i == 0 || i == 1 || i == 2 || i == 12 || i == 22)
				expect(cells[i].style.getPropertyValue('--cell-color')).toBe('blue');
			else expect(cells[i].style.getPropertyValue('--cell-color')).toBe('red');
		}
	});
});
