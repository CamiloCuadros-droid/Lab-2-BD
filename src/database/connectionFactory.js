import mysql from 'mysql2/promise';

export function createDatabaseConnection(databaseConfig) {
  return mysql.createConnection({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.name,
    dateStrings: true,
  });
}
