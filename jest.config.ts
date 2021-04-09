export default {
  clearMocks: true,
  coverageDirectory: "out/coverage",
  testEnvironment: "node",
  reporters: ["default"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  setupFilesAfterEnv: ["jest-chain"],
};
