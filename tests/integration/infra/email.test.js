import email from 'infra/email';
import orchestrator from '../api/v1/orchestrator';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe('infra/email.js', () => {
  test('send()', async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: 'BusNews <contato@busnews.com.br>',
      to: '<contato@curso.dev>',
      subject: 'Teste de assunto',
      text: 'Teste de corpo',
      //html: '<h1>Teste de HTML</h1>',
    });

    await email.send({
      from: 'BusNews <contato@busnews.com.br>',
      to: '<contato@curso.dev>',
      subject: 'último email enviado',
      text: 'Corpo do último email',
      //html: '<h1>Teste de HTML</h1>',
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe('<contato@busnews.com.br>');
    expect(lastEmail.recipients[0]).toBe('<contato@curso.dev>');
    expect(lastEmail.subject).toBe('último email enviado');
    expect(lastEmail.text).toBe('Corpo do último email\r\n');
  });
});
