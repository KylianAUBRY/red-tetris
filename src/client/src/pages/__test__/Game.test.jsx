import { describe, beforeEach, it } from 'vitest';
import Game from '../Game.jsx';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getStore } from '../../../../store_for_test.js';

const mockStore = configureStore([]);

describe('Game Component', () => {
	let store;

	const initialState = getStore();
	beforeEach(() => {
		store = mockStore(initialState);
	});

	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<Provider store={store}>
					<Game />
				</Provider>
			</MemoryRouter>
		);
	});
});
