import {expect, describe, beforeEach, it, vi} from 'vitest';
import Server from '../Server.js'
import { mock } from 'node:test';
// import crypto from 'crypto';

vi.mock('socket.io', async () => {
	const original = await vi.importActual('socket.io');
	return {
	  ...original,
	  SocketServer: vi.fn(),
	};
  });

vi.mock('crypto', () => ({
	randomUUID: vi.fn(() => 'mock-session-id'),
}));

describe('Server server', () => {	
	let serverInstance, mockSocket, games;

	beforeEach(async () => {
		serverInstance = new Server({}, {})

		serverInstance.removeGame = vi.fn();

		mockSocket = {
			emit: vi.fn(),
			handshake: {
				auth: {}
		}
    };
	});

	it('call Server', () => {
		let serv = new Server();
		serv.initTopic();
		const room = "test-room";
		serverInstance.topic.emit('empty', room);

    	expect(serverInstance.removeGame).toHaveBeenCalledWith(room);
	});

	it('call newSession', () => {
		serverInstance.newSession(mockSocket);
	
		expect(mockSocket.emit).toHaveBeenCalled();
	});

	it('call onConnection', () => {
		serverInstance.onConnection(mockSocket);
	
		expect(mockSocket.emit).toHaveBeenCalled();
		mockSocket.handshake.auth.room = true;
		serverInstance.onConnection(mockSocket);
		
		expect(mockSocket.emit).toHaveBeenCalled();
	});
});