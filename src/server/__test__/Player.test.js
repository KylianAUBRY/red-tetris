import { expect, describe, beforeEach, it, vi } from 'vitest';
import Player from '../Player.js';
import {
	DEFAULT_STATS,
	PIECE_I,
	PIECE_O,
	PIECE_T,
	PIECE_J,
	PIECE_L,
	PIECE_S,
	PIECE_Z,
} from '../../constants.js';

describe('Game server', () => {
	let playerInstance;

	it('call player', () => {
		new Player('test', { on: vi.fn() });
	});

	beforeEach(async () => {
		playerInstance = new Player('test', {
			on: vi.fn(),
			emit: vi.fn(),
			off: vi.fn(),
		});
		playerInstance.socket = {
			on: vi.fn(),
			emit: vi.fn(),
			handshake: {
				auth: {
					sessionid: 10,
				},
			},
		};
	});
	it('call gameSub', () => {
		playerInstance.gameSub('', { bind: vi.fn() });
		expect(playerInstance.gameTopic.on).toHaveBeenCalled();
		expect(playerInstance.gameSubArray).not.toBe();
		expect(playerInstance.gameSubArray).toBeTruthy();
	});
	
	it('call gameSend', () => {
		playerInstance.gameSend('', { bind: vi.fn() });
		expect(playerInstance.gameTopic.emit).toHaveBeenCalled();
	});
	
	it('call on', () => {
		playerInstance.connected = true;
		playerInstance.on('', { bind: vi.fn() });
		expect(playerInstance.socket.on).toHaveBeenCalled();
	});

	it('call emit', () => {
		playerInstance.connected = true;
		playerInstance.emit('', { bind: vi.fn() });
		expect(playerInstance.socket.emit).toHaveBeenCalled();
	});

	it('call setOwner', () => {
		playerInstance.owner = false;
		playerInstance.setOwner(true, false);
		expect(playerInstance.owner).toBe(true);
	});

	it('call setReady', () => {
		playerInstance.ready = false;
		playerInstance.setReady(true);
		expect(playerInstance.ready).toBe(true);
	});

	it('call setLost', () => {
		playerInstance.lost = false;
		playerInstance.setLost(true);
		expect(playerInstance.lost).toBe(true);
	});

	it('call updateStats', () => {
		playerInstance.updateStats({ ...DEFAULT_STATS });
	});
	let tmpInstance;
	
	it('call initGameTopic', () => {
		tmpInstance = new Player('test', {
			on: vi.fn(),
			emit: vi.fn(),
			off: vi.fn(),
		});
		tmpInstance.socket = { on: vi.fn(), emit: vi.fn() };

		tmpInstance.gameSub = vi.fn();
		tmpInstance.endGame = vi.fn();
		tmpInstance.emit = vi.fn();
		tmpInstance.name = 'player1';
		tmpInstance.initGameTopic();

		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'start',
			tmpInstance.startGame
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'connect',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'owner',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'ready',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'lost',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'stats',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'newTurn',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'penality',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'quit',
			expect.any(Function)
		);
		expect(tmpInstance.gameSub).toHaveBeenCalledWith(
			'end',
			tmpInstance.endGame
		);
	});

	it('should emit readyCallback', () => {
		let ready = true;
		const readyCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'ready'
		)[1];
		readyCallback('player2', ready);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			ready,
		});
	});

	it('should emit addOpponent', () => {
		const opponent = 'player2';
		tmpInstance.initGameTopic();

		const connectCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'connect'
		)[1];
		connectCallback('player2', opponent);

		expect(tmpInstance.emit).toHaveBeenCalledWith('addOpponent', opponent);
	});

	it('should emit updateOpponent', () => {
		const owner = true;
		tmpInstance.initGameTopic();
		const ownerCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'owner'
		)[1];
		ownerCallback('player2', owner);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			owner,
		});
	});

	it('should emit updateOpponent', () => {
		const ready = true;
		tmpInstance.initGameTopic();

		const readyCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'ready'
		)[1];
		readyCallback('player2', ready);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			ready,
		});
	});

	it('should emit updateOpponent', () => {
		const lost = true;
		const colHeights = [1, 2, 3];
		tmpInstance.initGameTopic();

		const lostCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'lost'
		)[1];
		lostCallback('player2', lost, colHeights);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			lost,
			colHeights,
		});
	});

	it('should emit updateOpponent', () => {
		const stats = { score: 100 };
		tmpInstance.initGameTopic();

		const statsCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'stats'
		)[1];
		statsCallback('player2', stats);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			stats,
		});
	});

	it('should emit updateOpponent', () => {
		const clearCount = 2;
		const colHeights = [1, 2, 3];
		tmpInstance.initGameTopic();

		const newTurnCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'newTurn'
		)[1];
		newTurnCallback('player2', clearCount, colHeights);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			colHeights,
		});
	});
	
	it('should emit updateOpponent', () => {
		const colHeights = [1, 2, 3];
		tmpInstance.initGameTopic();

		const penaltyCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'penality'
		)[1];
		penaltyCallback('player2', colHeights);

		expect(tmpInstance.emit).toHaveBeenCalledWith('updateOpponent', {
			name: 'player2',
			colHeights,
		});
	});

	it('should emit removeOpponent', () => {
		tmpInstance.initGameTopic();

		const quitCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'quit'
		)[1];
		quitCallback('player2');

		expect(tmpInstance.emit).toHaveBeenCalledWith('removeOpponent', 'player2');
	});

	it('should call endGame', () => {
		tmpInstance.initGameTopic();

		const endCallback = tmpInstance.gameSub.mock.calls.find(
			(call) => call[0] === 'end'
		)[1];
		endCallback();

		expect(tmpInstance.endGame).toHaveBeenCalled();
	});

	it('call clearGameTopic', () => {
		let size = tmpInstance.gameSubArray.length;
		tmpInstance.clearGameTopic();

		expect(tmpInstance.gameTopic.off).toHaveBeenCalledTimes(size);
		expect(tmpInstance.gameSubArray.length).toBe(0);
	});

	it('call connection', () => {
		playerInstance.connection({ on: vi.fn(), emit: vi.fn() });
		playerInstance.connected = true;
		playerInstance.socket = {
			on: vi.fn(),
			emit: vi.fn(),
			handshake: {
				auth: {
					sessionid: 1,
				},
			},
		};
		playerInstance.connection({
			on: vi.fn(),
			emit: vi.fn(),
			handshake: {
				auth: {
					sessionid: 10,
				},
			},
		});
	});

	it('call disconnection', () => {
		playerInstance.socket = {
			removeAllListeners: vi.fn(),
			disconnect: vi.fn(),
		};
		playerInstance.connected = true;
		playerInstance.disconnection();
	});
	
	it('call startGame', () => {
		playerInstance.ready = true;
		playerInstance.startGame(10);
		playerInstance.ready = false;
		playerInstance.startGame(10);
	});

	it('call startGameEvents', () => {
		playerInstance.startGameEvents();
	});

	it('call clearGameEvents', () => {
		playerInstance.socket = {
			...playerInstance.socket,
			removeAllListeners: vi.fn(),
		};
		playerInstance.clearGameEvents();
	});

	it('call endGame', () => {
		playerInstance.endGame({});
	});

	it('call generateNextShapes', () => {
		playerInstance.generateNextShapes();
	});
	
	it('call updateGravity', () => {
		playerInstance.updateGravity();
	});
	
	it('call newPiece', () => {
		let shapesBundle = [
			PIECE_I,
			PIECE_O,
			PIECE_T,
			PIECE_J,
			PIECE_L,
			PIECE_S,
			PIECE_Z,
		];
		playerInstance.nextShapes.push(...playerInstance.rand.shuf(shapesBundle));
		playerInstance.newPiece();
	});
	
	it('call newTurn', () => {
		playerInstance.board.pieceCollides = vi.fn();
		playerInstance.board.pieceOutOfBounds = vi.fn().mockReturnValue(true);
		playerInstance.socket.removeAllListeners = vi.fn();
		playerInstance.newTurn();
		playerInstance.board.pieceOutOfBounds = vi.fn().mockReturnValue(false);
		playerInstance.board.fixPiece = vi.fn();
		let shapesBundle = [
			PIECE_I,
			PIECE_O,
			PIECE_T,
			PIECE_J,
			PIECE_L,
			PIECE_S,
			PIECE_Z,
		];
		playerInstance.nextShapes.push(...playerInstance.rand.shuf(shapesBundle));
		playerInstance.board.clearLine = vi.fn().mockRejectedValue(true);
		playerInstance.board.pieceTotallyOutOfBounds = vi
			.fn()
			.mockRejectedValue(true);
		playerInstance.newTurn();
	});
	
	it('call movePiece', () => {
		let obj = {
			x: 0,
			y: 0,
			clone: vi.fn().mockReturnValue({
				x: 0,
				y: 0,
				clone: vi.fn().mockReturnValue(),
				move: vi.fn(),
			}),
			move: vi.fn(),
		};

		playerInstance.piece = obj;
		playerInstance.board.pieceCollides = vi.fn().mockReturnValue(false);
		playerInstance.movePiece('down', true);
	});
	/*
	it('call rotatePiece', () => {
		let obj = {
			x: 0,
			y: 0,
			clone: vi.fn().mockReturnValue({
				x: 0,
				y: 0,
				clone: vi.fn().mockReturnValue(),
				move: vi.fn(),
				rotate: vi.fn(),
			}),
			move: vi.fn(),
		};
		playerInstance.piece = obj;
		playerInstance.board.pieceCollides = vi.fn().mockReturnValue(false);
		playerInstance.rotatePiece();
	});

	it('call dropPiece', () => {
		let obj = {
			x: 0,
			y: 0,
			clone: vi.fn().mockReturnValue({
				x: 0,
				y: 0,
				clone: vi.fn().mockReturnValue(),
				move: vi.fn(),
				rotate: vi.fn(),
			}),
			move: vi.fn(),
		};
		playerInstance.piece = obj;
		playerInstance.board.pieceCollides = vi.fn((prix) => {
			return prix.y > 10 ? true : false;
		});
		playerInstance.board.pieceOutOfBounds = vi.fn().mockReturnValue(true);
		playerInstance.socket.removeAllListeners = vi.fn();
		playerInstance.dropPiece();
	});

	it('call penality', () => {
		let obj = {
			x: 0,
			y: 0,
			clone: vi.fn().mockReturnValue({
				x: 0,
				y: 0,
				clone: vi.fn().mockReturnValue(),
				move: vi.fn(),
				rotate: vi.fn(),
			}),
			move: vi.fn(),
		};
		playerInstance.piece = obj;

		playerInstance.board.pieceOutOfBounds = vi.fn().mockReturnValue(true);
		playerInstance.socket.removeAllListeners = vi.fn();
		playerInstance.lost = false;
		playerInstance.penality(10);
	});

	it('call quit', () => {
		playerInstance.socket.removeAllListeners = vi.fn();
		playerInstance.quit(10);
	});
	*/
});
