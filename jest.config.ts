// import type { Config } from '@jest/types';

// const config: Config.InitialOptions = {
//   preset: 'ts-jest', // Use ts-jest preset for TypeScript
//   testEnvironment: 'node', // Set the environment to node.js
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
//   },
//   moduleFileExtensions: ['ts', 'js', 'json'], // Ensure Jest can process TypeScript files
//   testMatch: ['**/src/testcases/**/*.test.ts', '**/src/testcases/**/*.spec.ts'], // Define where Jest should look for test files
//   transformIgnorePatterns: ['node_modules/(?!(some-module-to-transform)/)'], // Optional: If you need to transform node_modules
//   moduleNameMapper: {
//     // If you have TypeScript path aliases, map them here
//     '^@app/(.*)$': '<rootDir>/src/app/$1', // Example for an alias: @app/* maps to src/app/*
//   },
//   coverageDirectory: './coverage', // Optional: Specify where to store coverage reports
//   collectCoverage: true, // Optional: Enable code coverage collection
//   coverageProvider: 'v8', // Optional: Use V8 for code coverage collection (faster)
// };

// export default config;

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',  // Use ts-jest preset for TypeScript
  testEnvironment: 'node',  // Set the environment to node.js
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Transform TypeScript files
  },
  moduleFileExtensions: ['ts', 'js', 'json'],  // Ensure Jest can process TypeScript files
  transformIgnorePatterns: ['node_modules/(?!(some-module-to-transform)/)'],  // Optional: If you need to transform node_modules
  testMatch: ['**/src/testcases/**/*.test.ts', '**/src/testcases/**/*.spec.ts'],
};

export default config;
