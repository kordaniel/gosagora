const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json');

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  collectCoverage: true,
  coverageDirectory: "<rootDir>/reports/testcoverage",
  maxWorkers: "50%",
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: '<rootDir>/' }
  ),
};
