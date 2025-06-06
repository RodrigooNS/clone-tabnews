import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVerResult = await database.query("SHOW server_version;");
  const postgresVer = postgresVerResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const activeConnectionsResult = await database.query({
    text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const activeConnections = activeConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: parseFloat(postgresVer),
        max_connections: parseInt(maxConnections),
        active_connections: activeConnections,
      },
    },
  });
}

export default status;
