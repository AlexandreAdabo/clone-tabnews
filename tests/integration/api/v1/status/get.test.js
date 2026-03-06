import orchestrator from '../orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.runPendingMigrations();
});

describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.updated_at).toBeDefined();
      expect(data.dependencies.database.max_connections).toBeDefined();
      expect(data.dependencies.database.used_connections).toBeDefined();

      expect(data.dependencies.database).not.toHaveProperty('db_version');
      expect(data.dependencies.database.max_connections).toEqual(901);
      //expect(data.dependencies.database.used_connections).toEqual(1);
      const parsedUpdatedAt = new Date(data.updated_at).toISOString();
      expect(data.updated_at).toEqual(parsedUpdatedAt);
    });
  });

  describe('Privileged user', () => {
    test('Retrieving current system status', async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      await orchestrator.addFeaturesToUser(activatedUser, ['read:status:all']);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch('http://localhost:3000/api/v1/status', {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.updated_at).toBeDefined();
      expect(data.dependencies.database.max_connections).toBeDefined();
      expect(data.dependencies.database.used_connections).toBeDefined();

      expect(data.dependencies.database.version).toContain('16.12');
      expect(data.dependencies.database.max_connections).toEqual(901);
      //expect(data.dependencies.database.used_connections).toEqual(1);
      const parsedUpdatedAt = new Date(data.updated_at).toISOString();
      expect(data.updated_at).toEqual(parsedUpdatedAt);
    });
  });
});
