import controller from 'infra/controller';
import session from 'models/session';
import user from 'models/user';
import { createRouter } from 'next-connect';

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const sessionToken = req.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewedSession = await session.renew(sessionObject.id);
  controller.setSessionCookie(renewedSession.token, res);
  const userFound = await user.findOneById(sessionObject.user_id);
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, max-age=0, must-revalidade'
  );
  res.status(200).json(userFound);
}
