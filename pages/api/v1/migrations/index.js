import { runner as migrationRunner } from 'node-pg-migrate';
import database from 'infra/database';

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: 'pages/api/v1/migrations/migrations',
    direction: 'up',
    dryRun: true,
    verbose: true,
    migrationsTable: 'pgmigrations',
  };

  try {
    if (request.method === 'GET') {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      response.status(200).json(pendingMigrations);
      return;
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
        return;
      }
      response.status(200).json(migratedMigrations);
      return;
    }
    response.status(405).end();
    return;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await dbClient.end();
  }
}
