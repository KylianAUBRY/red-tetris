import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
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

io.on('connection', (socket) => {
	console.log('A client connected');
	socket.emit('welcome', 'Welcome to the server');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

if (PROD) {
	app.use(express.static(path.join(__dirname, '../dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../dist/index.html'));
	});
}

server.listen(PORT, () => console.log('App started on port: ' + PORT));
