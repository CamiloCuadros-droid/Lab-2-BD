const seasonTable = { tableName: 'season', idColumn: 'season_id', valueColumn: 'label' };
const teamTable = { tableName: 'team', idColumn: 'team_id', valueColumn: 'name' };

async function insertValuesAndMapIds(connection, tableDefinition, values) {
  const { tableName, idColumn, valueColumn } = tableDefinition;
  await connection.query('INSERT INTO ?? (??) VALUES ?', [
    tableName,
    valueColumn,
    values.map((value) => [value]),
  ]);
  const [rows] = await connection.query('SELECT ?? AS id, ?? AS value FROM ??', [
    idColumn,
    valueColumn,
    tableName,
  ]);
  return new Map(rows.map((row) => [row.value, row.id]));
}

export function insertSeasons(connection, seasonLabels) {
  return insertValuesAndMapIds(connection, seasonTable, seasonLabels);
}

export function insertTeams(connection, teamNames) {
  return insertValuesAndMapIds(connection, teamTable, teamNames);
}
