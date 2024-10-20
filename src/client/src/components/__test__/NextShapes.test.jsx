import { expect, describe, beforeEach, it } from 'vitest';
import NextShapes from '../NextShapes.jsx';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getStore, getPiece } from "../../../../store_for_test.js"
import { NEXT_PIECE_COUNT } from '../../../../constants.js';

const mockStore = configureStore([]);

describe('NextShapes Component', () => {
	let store;

	const initialState = getStore();

	beforeEach(() => {
		store = mockStore(initialState);
	});

	it('renders shape null without crashing', () => {
		render(
			<Provider store={store}>
				<NextShapes />
			</Provider>
		);
	});

	it('renders shape full without crashing', () => {
		let piece = getPiece();
		let state = initialState;
		state.nextShapes.shapes = Array(NEXT_PIECE_COUNT).fill([[piece]]);
		store = mockStore(state);
		render(
			<Provider store={store}>
				<NextShapes />
			</Provider>
		);
	});

});
