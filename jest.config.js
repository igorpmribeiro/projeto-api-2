import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default {
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	moduleFileExtensions: ['js', 'json'],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	collectCoverageFrom: ['src/**/*.{js,jsx}'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov'],
};
