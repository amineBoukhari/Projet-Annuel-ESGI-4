module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  reporters: [
    "default",
    ["jest-sonar", { outputDirectory: "test-report", outputName: "test-report.xml" }],
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
};
