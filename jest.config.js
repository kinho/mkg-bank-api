/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: { 
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts'],
  "collectCoverageFrom": [
    "src/modules/**/*.{js,ts}",
    "!src/modules/**/*.context.ts",
    "!src/modules/**/*.schema.ts",
    "!src/modules/**/*.type.ts",
  ],
}
