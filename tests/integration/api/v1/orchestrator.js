import retry from 'async-retry';
import database from 'infra/database';
import migrator from 'models/migrator';

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 100,
      maxTimeout: 500,
    });
    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3000/api/v1/status');
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query(`drop schema public cascade; create schema public;`);
}

/**
 * Limpa apenas os dados, mantendo o schema. Muito mais rápido que clearDatabase.
 * Não apaga pgmigrations, então runPendingMigrations continua no-op depois da primeira vez.
 */
async function truncateTables() {
  const rows = await database.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename != 'pgmigrations'
  `);
  const tables = rows.map((r) => r.tablename);
  if (tables.length === 0) return;
  const quoted = tables.map((t) => `"${t}"`).join(', ');
  await database.query(`TRUNCATE ${quoted} RESTART IDENTITY CASCADE`);
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  truncateTables,
  runPendingMigrations,
};

export default orchestrator;
