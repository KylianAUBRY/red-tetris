import express from 'express';
import { createServer } from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Server from './Server.js';
import { PORT, PROD } from '../constants.js';

const app = express();
const server = createServer(app);

const cors = PROD
	? undefined
	: {
			origin: 'http://localhost:5173',
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type'],
			credentials: true,
		};

const config = {
	cors,
	pingInterval: 10000,
	pingTimeout: 5000,
};

new Server(server, config);

if (PROD) {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	app.use(express.static(path.join(__dirname, '../../dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../dist/index.html'));
	});
}

server.listen(PORT, () => console.log('App started on port: ' + PORT));
