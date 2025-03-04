import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function status(request, response) {
  if (request.method === "GET" || request.method === "POST") {
    let dbClient;
    try {
      dbClient = await database.getNewClient();
      const migrations = await migrationRunner({
        dbClient: dbClient,
        dryRun: request.method === "GET",
        dir: join("infra", "migrations"),
        direction: "up",
        verbose: true,
        migrationsTable: "pgmigrations",
      });

      if (migrations.length > 0) {
        return response.status(201).json(migrations);
      }
      return response.status(200).json(migrations);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await dbClient.end();
    }
  }

  return response.status(405).json({
    error: `Method ${request.method} not allowed`,
  });
}
