const { exec } = require('node:child_process');

function checkPostgres() {
  exec('docker exec postgres-dev pg_isready --host localhost', handleReturn);
  function handleReturn(error, stdout, stderr) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.');
      checkPostgres();
      return;
    }
    if (error) {
      console.error('Erro ao verificar Postgres:', error);
      return;
    }
    if (stdout.includes('accepting connections')) {
      console.log('\n 🟢 Postgres está aceitando conexões');
    }
  }
}

process.stdout.write('🔴 Aguardando Postgers aceitar conexões');
checkPostgres();
