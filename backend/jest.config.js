module.exports = {
  reporters: [
    "default",
    ["jest-sonar", { outputDirectory: "test-report", outputName: "test-report.xml" }],
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
};
