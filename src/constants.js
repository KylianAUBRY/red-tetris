export const PROD =
	import.meta?.env?.PROD || process.env.NODE_ENV === 'production';
export const PORT = 4000;
export const WIDTH = 10;
export const HEIGHT = 20;
export const MAX_DELAY = 1000;
export const MIN_DELAY = 20;
export const ACCELERATION = 50;
export const NEXT_PIECE_COUNT = 4;
export const PIECE_COUNT = 7;

export const BACK_COLOR = '#282c34';
export const FRONT_COLOR = '#048b9a';
export const PENALTY_COLOR = 'gray';
export const SPECTRE_COLOR = 'gray';

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
