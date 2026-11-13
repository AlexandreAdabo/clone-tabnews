import { useState } from 'react';
import { Button, FormControl, TextInput, Stack, Heading } from '@primer/react';
import DefaultLayout from 'interface/DefaultLayout';

export default function RegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Cadastro',
        description: 'Página de cadastro do FinTab',
      }}
    >
      <Stack gap="normal" alignItems="center">
        <Heading as="h1">Cadastro</Heading>
        <RegisterForm />
      </Stack>
    </DefaultLayout>
  );
}

function RegisterForm() {
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
    <form onSubmit={handleSubmit}>
      <Stack gap="normal">
        <FormControl>
          <FormControl.Label>Nome do usuário</FormControl.Label>
          <TextInput
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Senha</FormControl.Label>
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            block
          />
        </FormControl>
        <Stack.Item>
          <Button variant="primary" type="submit">
            Criar cadastro
          </Button>
        </Stack.Item>
      </Stack>
    </form>
  );
}
