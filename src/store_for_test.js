import { HEIGHT, WIDTH, NEXT_PIECE_COUNT } from './constants.js';

export function getStore() {
	let opponent = getOpponent();

	let initialState = {
		board: {
			grid: Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null)),
			width: WIDTH,
			height: HEIGHT
		},
		piece: {
			shape: [
				[null, 'cyan', null],
				['cyan', 'cyan', 'cyan'],
				[null, null, null],
			],
			x: 3,
			y: 3,
		},
		player: {
			name: "testPlayeurName",
			connected: true,
			owner: false,
			ready: true,
			lost: false, 
			stats : {
				score: 1,
				level: 2,
				lines: 5
			}
		},
		nextShapes: {
			shapes: Array(NEXT_PIECE_COUNT).fill([[null]]),
		},
		game: {
			room: "test",
			started : false,
			opponents: Array(5).fill(opponent)
		}
	}
	return initialState;
}

export function getOpponent() {
	let opponent =  {
		name : "test",
		ready : true,
		lost: false,
		owner: false,
		colHeights: Array(HEIGHT).fill(2),
		stats : {
			score: 1,
			level: 2,
			lines: 5
		}
	};
	return opponent;
}