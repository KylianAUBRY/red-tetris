import {expect, describe, beforeEach, it} from 'vitest';
import OpponentsBox from '../OpponentsBox.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { FRONT_COLOR,
	OWNER_COLOR,
	SPECT_COLOR,
	LOST_COLOR,
	HEIGHT
} from '../../../../constants.js';

const mockStore = configureStore([]);

describe('Opponent Component', () => {
	let store;

	let opponent =  {
		name : "test",
		ready : false,
		lost: false,
		owner: false,
		colHeights: Array(HEIGHT).fill(2),
		stats : {
			score: 1,
			level: 2,
			lines: 5
		}
	};
	
	const initialState = {
		game : {
			started : false,
			opponents: Array(5).fill(opponent)
		}
	};
	initialState.game.opponents[0].owner = true;

	beforeEach(() => {
        store = mockStore(initialState); 
    });

	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<OpponentsBox />
			</Provider>
		);
	});
	it('renders the correct number of opponent', () => {
		const { container } = render(
			<Provider store={store}>
				<OpponentsBox />
			</Provider>
		);
		const cells = container.getElementsByClassName('opponent');
		expect(cells.length).toBe(5);
	});

	it('renders the correct number of opponent(16)', () => {
		let state = initialState;
		state.game.opponents = Array(16).fill(opponent)
		initialState.game.opponents[0].owner = true;
		store = mockStore(state); 
		const { container } = render(
			<Provider store={store}>
				<OpponentsBox />
			</Provider>
		);
		const cells = container.getElementsByClassName('opponent');
		expect(cells.length).toBe(16);
	});

	it('renders the correct number of opponent', () => {
		let state = initialState;
		state.game.opponents = Array(0).fill(opponent);
		store = mockStore(state);
		const { container } = render(
			<Provider store={store}>
				<OpponentsBox />
			</Provider>
		);
		const cells = container.getElementsByClassName('opponent');
		expect(cells.length).toBe(0);
	});
});