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

let games = new Map();

io.on('connection', function (socket) {
	console.log(socket.handshake.auth);

	const room = socket.handshake.auth.room;
	let game = games.get(room);
	if (game) {
		game.addPlayer(socket);
	} else {
		game = new Game(room);
		game.addPlayer(socket);
		games.set(room, game);
	}
});

if (PROD) {
	app.use(express.static(path.join(__dirname, '../../dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../dist/index.html'));
	});
}

server.listen(PORT, () => console.log('App started on port: ' + PORT));
