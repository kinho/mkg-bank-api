/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '^.+.tsx?$': ['ts-jest',{}] },
  moduleNameMapper: { 
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts'],
}
