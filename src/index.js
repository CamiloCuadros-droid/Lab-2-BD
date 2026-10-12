import { loadConfig } from './config/environment.js';
import { readMatchRecords } from './csv/matchCsvReader.js';
import { createDatabaseConnection } from './database/connectionFactory.js';
import { describeLoadError } from './errors/loadErrorDescriber.js';
import { loadMatches } from './services/matchLoaderService.js';
import { validateMatchRecords } from './validation/matchRowValidator.js';
import { allChecksPassed, formatChecks, verifyLoad } from './verification/loadVerifier.js';

const maxReportedRejections = 20;

function formatRejections(rejectedRows) {
  const reportedRows = rejectedRows.slice(0, maxReportedRejections);
  const lines = reportedRows.map(({ lineNumber, reason }) => `  línea ${lineNumber}: ${reason}`);
  const omittedCount = rejectedRows.length - reportedRows.length;
  if (omittedCount > 0) {
    lines.push(`  y ${omittedCount} filas más`);
  }
  return lines.join('\n');
}

function prepareMatches(csvPath) {
  const { validMatches, rejectedRows } = validateMatchRecords(readMatchRecords(csvPath));
  if (rejectedRows.length > 0) {
    throw new Error(
      `Se rechazaron ${rejectedRows.length} filas del CSV y no se cargó nada:\n${formatRejections(rejectedRows)}`,
    );
  }
  if (validMatches.length === 0) {
    throw new Error('El archivo CSV no contiene partidos');
  }
  return validMatches;
}

async function runLoad() {
  const config = loadConfig();
  const matches = prepareMatches(config.csvPath);
  const connection = await createDatabaseConnection(config.database);
  try {
    await loadMatches(connection, matches, config.batchSize);
    const checks = await verifyLoad(connection, matches);
    console.log(formatChecks(checks));
    return allChecksPassed(checks);
  } finally {
    await connection.end();
  }
}

runLoad()
  .then((verificationPassed) => {
    process.exitCode = verificationPassed ? 0 : 1;
  })
  .catch((error) => {
    console.error(`Error en la carga: ${describeLoadError(error)}`);
    process.exitCode = 1;
  });
