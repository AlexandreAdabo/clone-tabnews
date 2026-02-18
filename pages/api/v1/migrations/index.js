import controller from 'infra/controller';
import { createRouter } from 'next-connect';
import migrator from 'models/migrator';

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
    const pendingMigrations = await migrator.listPendingMigrations();
    res.status(200).json(pendingMigrations);
  
}

async function postHandler(req, res) {
    const migratedMigrations = await migrator.runPendingMigrations();
    if (migratedMigrations.length > 0) {
      res.status(201).json(migratedMigrations);
    }
    res.status(200).json(migratedMigrations);

}
