test('GET /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.updated_at).toBeDefined();
  expect(data.dependencies.database.max_connections).toBeDefined();
  expect(data.dependencies.database.db_version).toBeDefined();
  expect(data.dependencies.database.used_connections).toBeDefined();

  expect(data.dependencies.database.db_version).toEqual('17.3');
  expect(data.dependencies.database.max_connections).toEqual(100);
  expect(data.dependencies.database.used_connections).toEqual(1);
  const parsedUpdatedAt = new Date(data.updated_at).toISOString();
  expect(data.updated_at).toEqual(parsedUpdatedAt);
});
