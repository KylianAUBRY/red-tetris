import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import store from './store';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/:room/:player_name' element={<App />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
