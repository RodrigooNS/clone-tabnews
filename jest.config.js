import nextJest from "next/jest.js";
import { config } from "dotenv";

config({ path: ".env.development" });

const createJestConfig = nextJest({
  dir: "./",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testEnvironment: "node",
  testTimeout: 60000,
});

export default jestConfig;
