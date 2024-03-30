/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: "./tests/jest.globalSetup.ts",
  globalTeardown: "./tests/jest.globalTeardown.ts",
  openHandlesTimeout: 0,
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
};
