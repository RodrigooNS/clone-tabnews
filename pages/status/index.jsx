import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  let pgVersion = "Carregando...";
  let pgMaxConnections = "Carregando...";
  let pgActiveConnections = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    pgVersion = data.database.version;
    pgMaxConnections = data.database.max_connections;
    pgActiveConnections = data.database.active_connections;
  }

  return (
    <>
      <div>Última atualização: {updatedAtText}</div>
      <div>Versão do Postgres: {pgVersion}</div>
      <div>Número máximo de conexões: {pgMaxConnections}</div>
      <div>Conexões ativas: {pgActiveConnections}</div>
    </>
  );
}
