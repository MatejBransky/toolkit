module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/tests-cypress/'],
  transform: {
    '^.+\\.(tsx|ts|js|html)$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
};
