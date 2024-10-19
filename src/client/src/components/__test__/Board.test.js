import Board from '../Board.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HEIGHT, WIDTH } from '../../../../constants.js';

const mockStore = configureStore([]);

describe('Board Component', () => {
    let store;

	let	initialState = {
        board: {
            grid: Array.from({ length: WIDTH }, () => Array(HEIGHT).fill(null)), // Grille initiale
        },
        piece: {
            shape: [
                [null, 'cyan', null],
                ['cyan', 'cyan', 'cyan'],
                [null, null, null],
            ],
            x: 3,
            y: 3,
        },
    };

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

	initialState.board.grid = Array.from({ length: WIDTH }, () => Array(HEIGHT).fill('red'));
	initialState.board.grid[0][1] = 'yellow'
	initialState.board.grid[0][2] = 'orange'
	initialState.board.grid[0][3] = 'green'
	initialState.board.grid[0][4] = 'purple'
	initialState.board.grid[0][5] = 'cyan'
	initialState.board.grid[0][6] = '#424242'

	it('renders without crashing', () => {
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


	
	initialState.board.grid = Array.from({ length: WIDTH }, () => Array(HEIGHT).fill('red'));
	initialState.piece.shape = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	],
	it('renders cells the correct color when the piece overlaps', () => {
		const { container } = render(
			<Provider store={store}>
				<Board />
			</Provider>
		);
		const cells = container.getElementsByClassName('board-cell');
		for (let i = 0; i < cells.length; i++) {

			expect(cells[i].style.getPropertyValue('--cell-color')).toBe("red"); // Toutes les cellules doivent avoir la couleur de la grille
		}
	});

});