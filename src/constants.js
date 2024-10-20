// export const PROD =
// 	import.meta?.env?.PROD || process.env.NODE_ENV === 'production';
export const PROD = false;

export const PORT = 4000;
export const WIDTH = 10;
export const HEIGHT = 20;
export const MAX_DELAY = 1000;
export const MIN_DELAY = 50;
export const ACCELERATION = 50;
export const MOVE_DELAY = 200;
export const MOVE_INTERVAL = 100;
export const NEXT_PIECE_COUNT = 4;
export const PIECE_COUNT = 7;
export const LEVEL_UP = 10;
export const SCORE_UNIT = 50;

export const FONT_COLOR = '#ffffff';
export const BACK_COLOR = '#282c34';
export const FRONT_COLOR = '#048b9a';
export const BOARD_COLOR = '#000000';
export const PENALITY_COLOR = '#cce5e8';
export const SPECTRE_COLOR = '#424242';
export const OWNER_COLOR = '#d3a939';
export const SPECT_COLOR = '#e5e3e4';
export const LOST_COLOR = '#db3448';

export const DEFAULT_STATS = {
	score: 0,
	level: 0,
	lines: 0,
};

export const START_OPPONENT = {
	lost: false,
	stats: DEFAULT_STATS,
	colHeights: Array(WIDTH).fill(0),
};

export const PIECE_I_COLOR = '#048b9a';
export const PIECE_O_COLOR = '#036670';
export const PIECE_T_COLOR = '#02464d';
export const PIECE_J_COLOR = '#037884';
export const PIECE_L_COLOR = '#279aa7';
export const PIECE_S_COLOR = '#4ca9b4';
export const PIECE_Z_COLOR = '#99cad0';

export const PIECE_I = [
	[null, null, null, null],
	[PIECE_I_COLOR, PIECE_I_COLOR, PIECE_I_COLOR, PIECE_I_COLOR],
	[null, null, null, null],
	[null, null, null, null],
];

export const PIECE_O = [
	[PIECE_O_COLOR, PIECE_O_COLOR],
	[PIECE_O_COLOR, PIECE_O_COLOR],
];

export const PIECE_T = [
	[null, PIECE_T_COLOR, null],
	[PIECE_T_COLOR, PIECE_T_COLOR, PIECE_T_COLOR],
	[null, null, null],
];

export const PIECE_J = [
	[PIECE_J_COLOR, null, null],
	[PIECE_J_COLOR, PIECE_J_COLOR, PIECE_J_COLOR],
	[null, null, null],
];

export const PIECE_L = [
	[null, null, PIECE_L_COLOR],
	[PIECE_L_COLOR, PIECE_L_COLOR, PIECE_L_COLOR],
	[null, null, null],
];

export const PIECE_S = [
	[null, PIECE_S_COLOR, PIECE_S_COLOR],
	[PIECE_S_COLOR, PIECE_S_COLOR, null],
	[null, null, null],
];

export const PIECE_Z = [
	[PIECE_Z_COLOR, PIECE_Z_COLOR, null],
	[null, PIECE_Z_COLOR, PIECE_Z_COLOR],
	[null, null, null],
];
