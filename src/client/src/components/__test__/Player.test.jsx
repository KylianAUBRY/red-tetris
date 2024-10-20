import {expect, describe, beforeEach, it} from 'vitest';
import Player from '../Player.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getStore, getOpponent } from "../../../../store_for_test.js"

const mockStore = configureStore([]);

describe('Player Component', () => {
	let store;

	let opponent = getOpponent();
	const initialState = getStore();

	beforeEach(() => {
        store = mockStore(initialState); 
    });

	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Player />
			</Provider>
		);
	});
});