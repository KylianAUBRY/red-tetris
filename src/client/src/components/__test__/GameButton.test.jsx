import { expect, describe, beforeEach, it, vi } from 'vitest';
import GameButton from '../GameButton.jsx';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getStore } from '../../../../store_for_test.js';

const mockSocketEmit = vi.fn();

vi.mock('../../hooks/useSocketRef', () => ({
	__esModule: true,
	default: () => ({
		current: {
			emit: mockSocketEmit,
		},
	}),
}));

const mockStore = configureStore([]);

describe('GameButton Component', () => {
	let store;

	let initialState = getStore();
	initialState.player.owner = true;

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
	};

	it('renders without crashing and testing the correct display of “start game”', () => {
		const container = renderComponent(initialState);
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe('Start Game');
	});

	it("testing the correct display of “Can't connect”", () => {
		let state = initialState;
		state.game.started = false;
		state.player.connected = false;
		const container = renderComponent(state);
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe("Can't connect");
	});

	it('testing the correct display of “Game in progress”', () => {
		let state = initialState;
		state.player.connected = true;
		state.game.started = true;
		const container = renderComponent(state);
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe('Game in progress');
	});

	it('testing the correct display of “Ready”', () => {
		let state = initialState;
		state.player.connected = true;
		state.game.started = false;
		state.player.owner = false;
		state.player.ready = false;
		const container = renderComponent(state);
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe('Ready');
	});

	it('testing the correct display of "Waiting owner”', () => {
		let state = initialState;
		state.player.connected = true;
		state.game.started = false;
		state.player.owner = false;
		state.player.ready = true;
		const container = renderComponent(state);
		const button = container.getElementsByClassName('game-button')[0];
		expect(button.textContent).toBe('Waiting owner');
	});

	it('calls the readyRequest function when clicked and player is not ready', async () => {
		const socketRef = { current: { emit: mockSocketEmit } };
		vi.spyOn(React, 'useRef').mockReturnValue(socketRef);

		let state = initialState;
		state.player.ready = false;
		state.player.owner = false;
		state.game.started = false;
		const container = renderComponent(state);
		const button = container.getElementsByClassName('game-button')[0];
		fireEvent.click(button);
		expect(mockSocketEmit).toHaveBeenCalledWith('ready');
	});

	it('calls the readyRequest function when clicked and player is ready', async () => {
		const socketRef = { current: { emit: mockSocketEmit } };
		vi.spyOn(React, 'useRef').mockReturnValue(socketRef);

		let state = initialState;
		state.player.ready = true;
		state.player.owner = true;
		state.game.started = false;
		const container = renderComponent(state);
		const button = container.getElementsByClassName('game-button')[0];
		fireEvent.click(button);
		expect(mockSocketEmit).toHaveBeenCalledWith('start');
	});
});
