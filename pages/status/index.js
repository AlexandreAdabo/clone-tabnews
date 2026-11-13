import DefaultLayout from 'interface/DefaultLayout';
import useSWR from 'swr';
import { Banner, Heading, Stack } from '@primer/react';
import { Card } from 'node_modules/@primer/react/dist/Card';

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
// swr | react query (TANSTACK)
export default function StatusPage() {
  return (
    <DefaultLayout
      contentWidth="medium"
      metadata={{ title: 'Status', description: 'Página de status do FinTab' }}
    >
      <Stack gap="spacious">
        <Heading as="h1"> Status </Heading>
        <UpdatedAt />
      </Stack>
    </DefaultLayout>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });
  let dataObj = {
    updatedAt: null,
    maxConnections: null,
    databaseVersion: null,
    openedConnections: null,
  };

  if (!isLoading && data) {
    const { dependencies, updated_at } = data;
    dataObj.updatedAt = new Date(updated_at).toLocaleString('pt-br');
    dataObj.databaseVersion = dependencies.database.db_version || '-';
    dataObj.maxConnections = dependencies.database.max_connections;
    dataObj.openedConnections = dependencies.database.used_connections;
  }

  return (
    <>
      {isLoading ? (
        <div>Carregando ...</div>
      ) : (
        <>
          <Stack>
            <Heading as="h2"> Database </Heading>
            <Stack
              direction={{ narrow: 'vertical', regular: 'horizontal' }}
              gap="spacious"
            >
              <Stack.Item grow>
                <Card>
                  <Card.Heading>Conexões abertas</Card.Heading>
                  <Card.Description>
                    {dataObj.openedConnections}
                  </Card.Description>
                  <Card.Metadata>Uso neste instante</Card.Metadata>
                </Card>
              </Stack.Item>

              <Stack.Item grow>
                <Card>
                  <Card.Heading>Conexões máximas</Card.Heading>
                  <Card.Description>{dataObj.maxConnections}</Card.Description>
                  <Card.Metadata>Conexões disponíveis</Card.Metadata>
                </Card>
              </Stack.Item>

              <Stack.Item grow>
                <Card>
                  <Card.Heading>PostgreSQL</Card.Heading>
                  <Card.Description>{dataObj.databaseVersion}</Card.Description>
                  <Card.Metadata>Versão do banco de dados</Card.Metadata>
                </Card>
              </Stack.Item>
            </Stack>
          </Stack>
          <Banner variant="info" layout="compact">
            <Banner.Title> UpdatedAt: {dataObj.updatedAt}</Banner.Title>
          </Banner>
        </>
      )}
    </>
  );
}
