import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: { globals: globals.browser },
		rules: {
			'nonblock-statement-body-position': ['error', 'below'],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	pluginJs.configs.recommended,
	pluginReact.configs.flat.recommended,
	eslintConfigPrettier,
];
