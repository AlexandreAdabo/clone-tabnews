import { version as uuidVersion } from 'uuid';
import orchestrator from '../orchestrator';
import session from 'models/session';
import setCookieParsers from 'set-cookie-parser';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('DELETE /api/v1/sessions', () => {
  describe('Default user', () => {
    test('With nonexistent session', async () => {
      const nonexistentToken =
        'c0153e168a21abd4a6fd92d6be1e8de01f1d6b9025123d0dd795CcijrCfZBuqDzBWp3qSrBEZCqBUfQVz4CWGHWF91iaEw';

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'DELETE',
        headers: {
          Cookie: `session_id=${nonexistentToken}`,
        },
      });
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        message: 'Usuário não possui uma sessão ativa.',
        action: 'Verifique se o usuário está logado e tente novamente.',
        status_code: 401,
      });
    });

    test('With expired session', async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: 'UserWithExpiredSession',
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'DELETE',
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        message: 'Usuário não possui uma sessão ativa.',
        action: 'Verifique se o usuário está logado e tente novamente.',
        status_code: 401,
      });
    });

    test('With valid session', async () => {
      const createdUser = await orchestrator.createUser({
        username: 'UserWithValidSession',
      });
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'DELETE',
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: sessionObject.id,
        token: sessionObject.token,
        user_id: sessionObject.user_id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renewal assertions
      expect(
        responseBody.expires_at < sessionObject.expires_at.toISOString()
      ).toEqual(true);
      expect(
        responseBody.updated_at > sessionObject.updated_at.toISOString()
      ).toEqual(true);

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParsers(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: 'session_id',
        value: 'invalid',
        maxAge: -1,
        path: '/',
        httpOnly: true,
      });
    });
  });
});
