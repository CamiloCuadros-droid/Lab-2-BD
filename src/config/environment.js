import 'dotenv/config';

const defaultDatabasePort = 3306;
const defaultBatchSize = 500;

function readRequiredVariable(variableName) {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(`Falta la variable de entorno obligatoria ${variableName}`);
  }
  return value;
}

function readPositiveInteger(variableName, defaultValue) {
  const rawValue = process.env[variableName];
  if (rawValue === undefined || rawValue === '') {
    return defaultValue;
  }
  const parsedValue = Number(rawValue);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`La variable ${variableName} debe ser un entero positivo`);
  }
  return parsedValue;
}

export function loadConfig() {
  return {
    database: {
      host: readRequiredVariable('DB_HOST'),
      port: readPositiveInteger('DB_PORT', defaultDatabasePort),
      user: readRequiredVariable('DB_USER'),
      password: process.env.DB_PASSWORD ?? '',
      name: readRequiredVariable('DB_NAME'),
    },
    csvPath: readRequiredVariable('CSV_PATH'),
    batchSize: readPositiveInteger('BATCH_SIZE', defaultBatchSize),
  };
}
