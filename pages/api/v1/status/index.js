import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const pgVersion = await database.query("SHOW server_version;");
  const pgMaxConnections = await database.query("SHOW max_connections;");
  const pgActiveConnections = await database.query(
    "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = 'dockerpostgres';",
  );
  response.status(200).json({
    updated_at: updatedAt,
    database: {
      version: pgVersion.rows[0].server_version,
      max_connections: parseInt(pgMaxConnections.rows[0].max_connections),
      active_connections: pgActiveConnections.rows[0].count,
    },
  });
}
