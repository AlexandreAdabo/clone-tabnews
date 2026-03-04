import orchestrator from '../orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.truncateTables();
  await orchestrator.deleteAllEmails();
});

describe('Use case: Registration Flow (all successful)', () => {
    test('Create user account', async () => {
        const response = await fetch('http://localhost:3000/api/v1/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: 'RegistrationFlow',
              email: 'registration.flow@gmail.com',
              password: 'RegistrationFlowPassword',
            }),
          });
          expect(response.status).toBe(201);
          const responseBody = await response.json();
          expect(responseBody).toEqual({
            id: responseBody.id,
            username: 'RegistrationFlowPassword',
            email: 'registration.flow@gmail.com',
            features: ['read:activation_token'],
            password: responseBody.password,
            created_at: responseBody.created_at,
            updated_at: responseBody.updated_at,
          });
    });

    test('Receive activation email', async () => {
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

    test('Activate account', async () => {
      const createdUser = await orchestrator.createUser({
        username: 'UserWithValidSession',
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

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

    test('Login', async () => {
        const createdUser = await orchestrator.createUser({
          username: 'UserWithValidSession',
        });
  
        const sessionObject = await orchestrator.createSession(createdUser.id);
  
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

    test('Get user information', async () => {
        const createdUser = await orchestrator.createUser({
          username: 'UserWithValidSession',
        });
  
        const sessionObject = await orchestrator.createSession(createdUser.id);
  
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
