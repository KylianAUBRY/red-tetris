import { describe, beforeEach, afterEach, it, vi } from 'vitest';
import App from '../App';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import store from '../store';
import { Provider } from 'react-redux';

vi.mock('react-dom/client', () => ({
	createRoot: vi.fn(() => ({
		render: vi.fn(),
	})),
	default: {
		createRoot: vi.fn(() => ({
			render: vi.fn(),
		})),
	},
}));

document.body.innerHTML = '<div id="root"></div>';

describe('index.js', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="root"></div>';
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('should call ReactDOM.createRoot and render the App', async () => {
		await import('../main.jsx');
		ReactDOM.createRoot(document.getElementById('root')).render(
			<React.StrictMode>
				<Provider store={store}>
					<App />
				</Provider>
			</React.StrictMode>
		);
	});
});
