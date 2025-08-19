import retry from "async-retry";
import { faker } from "@faker-js/faker";
import database from "infra/database";
import migrator from "models/migrator.js";
import user from "models/user.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 2000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        console.log(
          `Failed to fetch status page - HTTP error ${response.status}`,
        );
        throw Error;
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject = {}) {
  return await user.create({
    username:
      userObject.username || faker.internet.username().replace(/[-_.]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "prototypePassword",
  });
}

export default {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};
