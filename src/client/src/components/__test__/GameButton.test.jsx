import {expect, describe, beforeEach, it} from 'vitest';
import GameButton from '../GameButton.jsx'
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('GameButton Component', () => {
	let store;

	const initialState = {
		player : {
			connected : true,
			ready : true,
			owner: true
		},
		game : {
			started: false
		}
	};

	beforeEach(() => {
        store = mockStore(initialState); 
    });

	const renderComponent = (state) => {
		store = mockStore(state);
		const { container } = render(
			<Provider store={store}>
				<GameButton />
			</Provider>
		);
		return container;
	}

    it('renders without crashing and testing the correct display of \“start game\”', () => {
		const container = renderComponent(initialState)
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe("Start Game");
	});

	it('testing the correct display of \“Can\'t connect\”', () => {
		let state = initialState;
		state.game.started = false;
		state.player.connected = false;
		const container = renderComponent(state)
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe("Can't connect");
	});
	
	it('testing the correct display of \“Game in progress\”', () => {
		let state = initialState;
		state.player.connected = true;
		state.game.started = true;
		const container = renderComponent(state)
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe("Game in progress");
	});

	it('testing the correct display of \“Ready\”', () => {
		let state = initialState;
		state.player.connected = true;
		state.game.started = false;
		state.player.owner = false;
		state.player.ready = false;
		const container = renderComponent(state)
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe("Ready");
	});
	
	it('testing the correct display of \"Waiting owner\”', () => {
		let state = initialState;
		state.player.connected = true;
		state.game.started = false;
		state.player.owner = false;
		state.player.ready = true;
		const container = renderComponent(state)
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe("Waiting owner");
	});
});