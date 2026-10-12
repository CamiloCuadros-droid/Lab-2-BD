const loadedTableNames = ['season', 'team', 'football_match', 'team_match_stats'];

export async function countRowsByTable(connection) {
  const rowCounts = {};
  for (const tableName of loadedTableNames) {
    const [rows] = await connection.query('SELECT COUNT(*) AS rowCount FROM ??', [tableName]);
    rowCounts[tableName] = Number(rows[0].rowCount);
  }
  return rowCounts;
}

export async function fetchTotalGoals(connection) {
  const [rows] = await connection.query(
    'SELECT SUM(home_goals + away_goals) AS totalGoals FROM football_match',
  );
  return Number(rows[0].totalGoals);
}
