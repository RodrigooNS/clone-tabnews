import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function status(request, response) {
  if (request.method === "GET" || "POST") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
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
  }

  return response.status(405).end();
}
