import {expect, describe, beforeEach, it} from 'vitest';
import Opponent from '../Opponent.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { FRONT_COLOR,
	OWNER_COLOR,
	SPECT_COLOR,
	LOST_COLOR,
	HEIGHT
} from '../../../../constants';

const mockStore = configureStore([]);

describe('Opponent Component', () => {
	let store;

	let opponent =  {
		name : "test",
		ready : false,
		lost: false,
		owner: true,
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
		}
		
	};

	beforeEach(() => {
        store = mockStore(initialState); 
    });

	it('renders without crashing', () => {
		render(
			
			<Provider store={store}>
				<Opponent opponent={opponent}/>
			</Provider>
		);
	});
});