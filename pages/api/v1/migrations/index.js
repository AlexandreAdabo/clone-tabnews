import controller from 'infra/controller';
import database from 'infra/database';
import { createRouter } from 'next-connect';
import migrationRunner from 'node-pg-migrate';
import { resolve } from 'path';

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  dir: resolve('infra', 'migrations'),
  dryRun: true,
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
};

async function getHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
      const pendingMigrations = await migrationRunner({...defaultMigrationOptions, dbClient});
      res.status(200).json(pendingMigrations);

  } finally {
    await dbClient.end();
  }
}

async function postHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dbClient,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        res.status(201).json(migratedMigrations);
      }
      res.status(200).json(migratedMigrations);
    
  } finally {
    await dbClient.end();
  }
}
