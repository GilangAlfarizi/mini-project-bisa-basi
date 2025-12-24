import type { Config } from 'jest';

const config: Config = {
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/application/usecases/**/*.(t|j)s',
    '!**/*index.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '@application/(.*)$': '<rootDir>/application/$1',
    '@data/(.*)$': '<rootDir>/data/$1',
    '@database/(.*)$': '<rootDir>/database/$1',
    '@database': '<rootDir>/database',
    '@domain/(.*)$': '<rootDir>/domain/$1',
    '@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '@presentation/(.*)$': '<rootDir>/presentation/$1',
  },
};

export default config;
