import { createRouter } from 'next-connect';
import database from '/infra/database.js';
import controller from 'infra/controller';
import authorization from 'models/authorization';

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const userTryingToGet = req.context.user;
  const [db_version] = await database.query(`SHOW server_version;`);
  const [max_connections] = await database.query(`SHOW max_connections;`);
  const [used_connections] = await database.query({
    text: `SELECT COUNT(*)::int AS used_connections FROM pg_stat_activity where datname = $1;`,
    values: [process.env.POSTGRES_DB],
  });
  const updatedAt = new Date().toISOString();

  const statusObject = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: db_version.server_version,
        max_connections: parseInt(max_connections.max_connections),
        used_connections: parseInt(used_connections.used_connections),
      },
    },
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    'read:status',
    statusObject
  );

  res.status(200).json(secureOutputValues);
}
