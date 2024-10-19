export default {
	testEnvironment: 'jsdom',
	transform: {
	  '^.+\\.jsx?$': 'babel-jest',
	},
	moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
	testPathIgnorePatterns: ['./node_modules/', './dist/'],
	moduleNameMapper: {
		'\\.(css|less|sass|scss)$': 'jest-css-modules',
	  },
  };
  