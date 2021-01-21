module.exports = {
  verbose: true,
  preset: "ts-jest",
  testMatch: ["<rootDir>/test/**.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
