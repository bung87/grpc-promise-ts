module.exports = {
  displayName: "rpc test",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["js", "ts"],
  modulePathIgnorePatterns: [
    "node_modules",
    "./src/lib/__tests__/lib/*",
    "dist",
  ],
  name: "test",
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
