module.exports = {
  testPathsIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spec.tsx",
  ],
  coverageReporters: ["lcov", "json"]
}