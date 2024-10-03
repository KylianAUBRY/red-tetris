export const PROD =
	import.meta?.env?.PROD || process.env.NODE_ENV === 'production';
export const PORT = 4000;
export const WIDTH = 10;
export const HEIGHT = 20;
export const MAX_DELAY = 1000;
export const MIN_DELAY = 50;
export const ACCELERATION = 50;
export const NEXT_PIECE_COUNT = 4;
export const PIECE_COUNT = 7;
export const LEVEL_UP = 10;
export const SCORE_UNIT = 50;

export const FONT_COLOR = 'white';
export const BACK_COLOR = '#282c34';
export const FRONT_COLOR = '#048b9a';
export const FRONT_BACK_COLOR = '#053b41';
export const BOARD_COLOR = '#000000';
export const PENALITY_COLOR = 'gray';
export const SPECTRE_COLOR = 'gray';

export const START_STATS = {
	score: 0,
	level: 0,
	lines: 0,
};

export const PIECE_I = [
	[null, null, null, null],
	['cyan', 'cyan', 'cyan', 'cyan'],
	[null, null, null, null],
	[null, null, null, null],
];

export const PIECE_O = [
	['yellow', 'yellow'],
	['yellow', 'yellow'],
];

export const PIECE_T = [
	[null, 'purple', null],
	['purple', 'purple', 'purple'],
	[null, null, null],
];

export const PIECE_J = [
	['blue', null, null],
	['blue', 'blue', 'blue'],
	[null, null, null],
];

export const PIECE_L = [
	[null, null, 'orange'],
	['orange', 'orange', 'orange'],
	[null, null, null],
];

export const PIECE_S = [
	[null, 'green', 'green'],
	['green', 'green', null],
	[null, null, null],
];

export const PIECE_Z = [
	['red', 'red', null],
	[null, 'red', 'red'],
	[null, null, null],
];
