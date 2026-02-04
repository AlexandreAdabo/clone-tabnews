import orchestrator from '../orchestrator.js';
import database from 'infra/database';

beforeAll(async () => {
  await cleanDatabase();
  await orchestrator.waitForAllServices();
});

async function cleanDatabase() {
  await database.query(`drop schema public cascade; create schema public;`);
}

test('GET /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  expect(response.status).toBe(200);
  const data = await response.json();
  console.log(
    JSON.stringify(data.dependencies.database),
    'data.dependencies.database'
  );
  expect(data.updated_at).toBeDefined();
  expect(data.dependencies.database.max_connections).toBeDefined();
  expect(data.dependencies.database.db_version).toBeDefined();
  expect(data.dependencies.database.used_connections).toBeDefined();

  expect(data.dependencies.database.db_version).toContain('16.11');
  expect(data.dependencies.database.max_connections).toEqual(901);
  expect(data.dependencies.database.used_connections).toEqual(1);
  const parsedUpdatedAt = new Date(data.updated_at).toISOString();
  expect(data.updated_at).toEqual(parsedUpdatedAt);
});
