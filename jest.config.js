module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 15000,
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["**/test/**/?(*.)+(spec|test).[jt]s?(x)"],
};
