import {expect, describe, beforeEach, it} from 'vitest';
import NextShapes from '../NextShapes.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getStore } from "../../store.js"

const mockStore = configureStore([]);

describe('NextShapes Component', () => {
	let store;

	const initialState = getStore();

	beforeEach(() => {
        store = mockStore(initialState); 
    });

	it('renders without crashing', () => {
		render(
			
			<Provider store={store}>
				<NextShapes />
			</Provider>
		);
	});
});