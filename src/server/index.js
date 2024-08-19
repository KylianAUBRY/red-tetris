import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Game from './Game.js';
import { PORT, PROD } from '../constants.js';

const app = express();
const server = createServer(app);

const corsConfig = PROD
	? {}
	: {
			cors: {
				origin: 'http://localhost:5173',
				methods: ['GET', 'POST'],
				allowedHeaders: ['Content-Type'],
				credentials: true,
			},
		};

const io = new Server(server, corsConfig);
const __dirname = dirname(fileURLToPath(import.meta.url));

io.on('connect', function (socket) {
	let game = new Game(socket);

	socket.on('move', (direction) => {
		game.movePiece(direction);
	});

	socket.on('rotate', () => {
		game.rotatePiece();
	});

	socket.on('drop', () => {
		game.dropPiece();
	});

	socket.on('disconnect', () => {});
});

if (PROD) {
	app.use(express.static(path.join(__dirname, '../../dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../dist/index.html'));
	});
}

server.listen(PORT, () => console.log('App started on port: ' + PORT));
