import { afterAll, beforeAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MONGO_URI, sessionStore } from "./app.js";

const TEST_DATABASE_NAME = "pizza-db-test";

const assertTestDatabase = () => {
  if (mongoose.connection.name !== TEST_DATABASE_NAME) {
    throw new Error(`Refusing to clean non-test database: ${mongoose.connection.name}`);
  }
};

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
  assertTestDatabase();
});

beforeEach(async () => {
  assertTestDatabase();
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  assertTestDatabase();
  await mongoose.connection.dropDatabase();
  await sessionStore.close();
  await mongoose.disconnect();
});
