import useSWR from 'swr';

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
// swr | react query (TANSTACK)
export default function StatusPage() {
  return (
    <>
      <h1> Status </h1>
      <UpdatedAt />
    </>
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
    dataObj.databaseVersion = dependencies.database.db_version;
    dataObj.maxConnections = dependencies.database.max_connections;
    dataObj.openedConnections = dependencies.database.used_connections;
  }

  return (
    <>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <table>
          <tr>
            <th> UpdatedAt:</th> <td>{dataObj.updatedAt}</td>
          </tr>
          <tr>
            <th> Max Connections:</th> <td>{dataObj.maxConnections}</td>
          </tr>
          <tr>
            <th> Opened Connections:</th> <td>{dataObj.openedConnections}</td>
          </tr>
          <tr>
            <th>Database Version: </th> <td>{dataObj.databaseVersion}</td>
          </tr>
        </table>
      )}
    </>
  );
}
