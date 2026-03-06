import controller from 'infra/controller';
import { ForbiddenError } from 'infra/errors';
import authorization from 'models/authorization';
import user from 'models/user';
import { createRouter } from 'next-connect';

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(getHandler);
router.patch(controller.canRequest('update:user'), patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const userTryingToGet = req.context.user;
  const username = req.query.username;
  const userFound = await user.findOneByUsername(username);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    'read:user',
    userFound
  );

  res.status(200).json(secureOutputValues);
}

async function patchHandler(req, res) {
  const userTryingToPatch = req.context.user;
  const username = req.query.username;
  const userInputValues = req.body;
  const targetUser = await user.findOneByUsername(username);

  if (!authorization.can(userTryingToPatch, 'update:user', targetUser)) {
    throw new ForbiddenError({
      message: 'Você não possui permissão para executar esta ação.',
      action: `Verifique se você possui a feature necessária para atualizar outro usuário`,
    });
  }

  const updatedUser = await user.update(username, userInputValues);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    'update:user',
    updatedUser
  );
  res.status(200).json(secureOutputValues);
}
