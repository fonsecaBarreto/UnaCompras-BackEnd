module.exports = {
 
  roots: ['<rootDir>/tests', '<rootDir>/src'],

  testTimeout: 90000,
  
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  transform: { '.+\\.ts$': 'ts-jest'},

  testEnvironment: 'node',

  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  }

};
