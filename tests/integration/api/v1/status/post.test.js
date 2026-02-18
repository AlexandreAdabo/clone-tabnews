import orchestrator from '../orchestrator.js';
import database from 'infra/database';

beforeAll(async () => {
  await cleanDatabase();
  await orchestrator.waitForAllServices();
});

async function cleanDatabase() {
  await database.query(`drop schema public cascade; create schema public;`);
}

describe('POST /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status', {
        method: 'POST'
      });
      expect(response.status).toBe(405);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint",
        action: "Verifique se o método HTTP enviado é válido para este endpoint",
        status_code: 405
      })
    });
  });
});
