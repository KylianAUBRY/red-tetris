import {expect, describe, beforeEach, it} from 'vitest';
import Opponent from '../Opponent.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getStore, getOpponent } from "../../../../store_for_test.js"

const mockStore = configureStore([]);

describe('Opponent Component', () => {
	let store;

	let opponent = getOpponent();
	const initialState = getStore();

	beforeEach(() => {
        store = mockStore(initialState); 
    });

	it('renders without crashing 1', () => {
		render(
			<Provider store={store}>
				<Opponent opponent={opponent}/>
			</Provider>
		);
	});

	it('renders without crashing 2', () => {
		let state = initialState;
		state.game.started = true;
		opponent.lost = true;
		store = mockStore(state);
		render(
			<Provider store={store}>
				<Opponent opponent={opponent}/>
			</Provider>
		);
	});

	it('renders without crashing 3', () => {
		opponent.ready = false;
		render(
			<Provider store={store}>
				<Opponent opponent={opponent}/>
			</Provider>
		);
	});

	it('renders without crashing 4', () => {
		opponent.ready = true;
		opponent.lost = false;
		opponent.owner = true;
		render(
			<Provider store={store}>
				<Opponent opponent={opponent}/>
			</Provider>
		);
	});

});