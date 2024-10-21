import {expect, describe, beforeEach, it, vi} from 'vitest';
import Game from '../Game.js'

vi.mock('socket.io', async () => {
	const original = await vi.importActual('socket.io');
	return {
		...original,
		SocketServer: vi.fn(),
	};
});

describe('Game server', () => {
	let gameInstance, mockSocket;
	it('call Game', () => {
		let game = new Game();
	});

	beforeEach(async () => {
		gameInstance = new Game({}, {})

		mockSocket = {
			emit: vi.fn(),
			handshake: {
				auth: {}
			}
    	};
	});

	it('call initTopic', () => {
		gameInstance.end = vi.fn();
		const room = "test-room";
		gameInstance.players = new Map()
		gameInstance.players.set("test-room", {lost: true})
		gameInstance.initTopic();
		gameInstance.topic.emit("lost", room, true);
		expect(gameInstance.end).toHaveBeenCalledWith(room);
		gameInstance.removePlayer = vi.fn();
		gameInstance.topic.emit("disconnect", room,);
		expect(gameInstance.removePlayer).toHaveBeenCalledWith(room);
	});

	it('call serverSub', () => {
		const mockCallback = vi.fn();
		gameInstance.serverTopic.on = vi.fn();
    	gameInstance.serverSub('testEvent', mockCallback);

		expect(gameInstance.serverTopic.on).toHaveBeenCalled();
		expect(gameInstance.serverSubArray).not.toStrictEqual([]);
	});

	it('call serverSend', () => {
		gameInstance.serverTopic.emit = vi.fn();
		gameInstance.serverSend("test", "test", "Test");
		expect(gameInstance.serverTopic.emit).toHaveBeenCalled();
	});

	it('call clearServerTopic', () => {
		gameInstance.serverTopic.off = vi.fn();
		gameInstance.serverSubArray = Array(10).fill({event: 1, callback: 1});
		gameInstance.clearServerTopic();
		expect(gameInstance.serverTopic.off).toHaveBeenCalledTimes(10);
		expect(gameInstance.serverSubArray.length).toBe(0);
	});

	it('call addPlayer', () => {
		let socket = {
			on: vi.fn(),
			emit: vi.fn(),
			handshake : {
				auth : {
					player_name: null,
				}
			}
		}
		gameInstance.addPlayer(socket);
		expect(socket.emit).toHaveBeenCalled();

		socket.handshake.auth.player_name = "test"
		gameInstance.players = new Map();
		gameInstance.players.set("test", {connection: vi.fn().mockReturnValue(true), toOpponent: vi.fn(), startGameEvents: vi.fn(), emit: vi.fn(), ready: false})
		gameInstance.addPlayer(socket);
		expect(gameInstance.players.get("test").connection).toHaveBeenCalled();
		expect(socket.emit).toHaveBeenCalled();
		gameInstance.started = true;
		gameInstance.addPlayer(socket);
		expect(gameInstance.players.get("test").emit).toHaveBeenCalled();
		gameInstance.players.get("test").ready = true;
		gameInstance.addPlayer(socket);
		expect(gameInstance.players.get("test").startGameEvents).toHaveBeenCalled();
		gameInstance.players = new Map()
		gameInstance.addPlayer(socket);
	});

	it('call startRequest', () => {
		gameInstance.started = true;
		let player = {
			emit: vi.fn()
		}
		gameInstance.startRequest(player);
		expect(player.emit).toHaveBeenCalled();
	});

	it('call readyRequest', () => {
		gameInstance.started = true;
		let player = {
			emit: vi.fn(),
			setReady: vi.fn()
		}
		gameInstance.readyRequest(player);
		expect(player.emit).toHaveBeenCalled();
		gameInstance.started = false;
		gameInstance.readyRequest(player);
		expect(player.setReady).toHaveBeenCalled();
	});

	it('call start', () => {
		gameInstance.topic.emit = vi.fn();
		gameInstance.started = false;
		gameInstance.start();
		expect(gameInstance.topic.emit).toHaveBeenCalled();
		expect(gameInstance.started).toBe(true);
	});

	it('call end', () => {
		gameInstance.removePlayer
		gameInstance.serverTopic.emit = vi.fn()
		gameInstance.players.set("test2", {connection: vi.fn().mockReturnValue(true), toOpponent: vi.fn(), startGameEvents: vi.fn(), emit: vi.fn(), ready: false, connected : false, quit : vi.fn()})
		gameInstance.end();
	});

	it('call delete', () => {
		gameInstance.delete();
	});
	
});