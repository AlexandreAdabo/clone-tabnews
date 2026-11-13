import { useState } from 'react';
import { Button } from '@primer/react';
import DefaultLayout from 'interface/DefaultLayout';

export default function RegisterPage() {
  console.log('Render do <RegisterPage />');

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    console.log('Submit do form', { userName, email, password });
    const requestBody = { username: userName, email, password };

    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status === 201) {
      location.href = '/cadastro/confirmar';
      alert('Cadastro realizado com sucesso!');
    }
  }

  return (
    <DefaultLayout
      metadata={{
        title: 'Cadastro',
        description: 'Página de cadastro do FinTab',
      }}
    >
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          Nome do usuário:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Criar cadastro</button>
        <Button variant="primary" as="a" href="/login">
          Criar cadastro
        </Button>
      </form>
    </DefaultLayout>
  );
}
