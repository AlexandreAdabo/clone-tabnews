import database from 'infra/database';
import migrationRunner from 'node-pg-migrate';
import { resolve } from 'path';
import { ServiceError } from 'infra/errors';

const defaultMigrationOptions = {
    dir: resolve('infra', 'migrations'),
    dryRun: true,
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  };

  async function listPendingMigrations() {
    let dbClient;
    try {
      dbClient = await database.getNewClient();
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dbClient,
      });
      return pendingMigrations
    } catch(error) {
      throw new ServiceError({
          message: "Erro ao listar migrações pendentes.",
          cause: error,
        });
    } 
    finally {
      await dbClient?.end();
    }
  }

  async function runPendingMigrations() {
    let dbClient;
    try {
      dbClient = await database.getNewClient();
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dbClient,
        dryRun: false,
      });
      return migratedMigrations
    } catch(error) {
        throw new ServiceError({
            message: "Erro ao executar migrações pendentes.",
            cause: error,
          });
      } 
      finally {
        await dbClient?.end();
      }
  }

  const migrator = {
    listPendingMigrations,
    runPendingMigrations
  }

  export default migrator