import database from 'infra/database';
import migrationRunner from 'node-pg-migrate';
import { resolve } from 'path';

export default async function migrations(req, res) {
  const allowedMethods = ['GET', 'POST'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dir: resolve('infra', 'migrations'),
      dryRun: true,
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    };
    if (req.method === 'GET') {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      res.status(200).json(pendingMigrations);
    }

    if (req.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        res.status(201).json(migratedMigrations);
      }
      res.status(200).json(migratedMigrations);
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await dbClient.end();
  }
}
