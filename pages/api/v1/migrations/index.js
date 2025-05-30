import { runner as migrationRunner } from 'node-pg-migrate';

export default async function migrations(request, response) {
  const dryRun = request.method === 'POST' ? false : true;
  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dir: 'infra/migrations',
    direction: 'up',
    dryRun: dryRun,
    verbose: true,
    migrationsTable: 'pgmigrations',
  });
  response.status(200).json(migrations);
}
