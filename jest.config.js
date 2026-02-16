module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/packages/**/*.test.ts', '<rootDir>/packages/**/*.test.tsx'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/packages/dashboard/app/$1',
  },
  collectCoverageFrom: [
    'packages/dashboard/app/**/*.{ts,tsx}',
    '!packages/dashboard/app/**/*.d.ts',
    '!packages/dashboard/app/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
