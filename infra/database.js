import { Client } from 'pg';

async function query(queryText, params) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  try {
    const res = await client.query(queryText || 'SELECT $1::text as message', params);
    return res.rows;
  } catch (error) {
    console.error('Database query error:', error);
  } finally {
    await client.end();
  }
}

export default {
  query,
};
