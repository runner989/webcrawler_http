// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^node-fetch$': 'jest-fetch-mock',
  },
};
