import { Client } from 'pg';

async function query(queryText, params) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'tabnews_clone',
    password: 'local_password',
  });
  await client.connect();

  const res = await client.query(queryText || 'SELECT $1::text as message', [
    'Hello world!',
  ]);
  await client.end();
  return res.rows;
}

export default {
  query,
};
