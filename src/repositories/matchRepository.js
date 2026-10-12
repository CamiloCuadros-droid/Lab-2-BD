import { insertInBatches } from './batchInserter.js';

const insertMatchesStatement =
  'INSERT INTO football_match (season_id, match_date, home_team_id, away_team_id, home_goals, away_goals) VALUES ?';
const insertStatisticsStatement =
  'INSERT INTO team_match_stats (match_id, team_id, possession, shots, shots_on_target, yellow_cards, red_cards) VALUES ?';

export function buildMatchKey(matchDate, homeTeamId) {
  return `${matchDate}|${homeTeamId}`;
}

export function insertMatches(connection, matchRecords, batchSize) {
  const rows = matchRecords.map((match) => [
    match.seasonId,
    match.matchDate,
    match.homeTeamId,
    match.awayTeamId,
    match.homeGoals,
    match.awayGoals,
  ]);
  return insertInBatches(connection, insertMatchesStatement, rows, batchSize);
}

export function insertTeamStatistics(connection, statisticsRecords, batchSize) {
  const rows = statisticsRecords.map((statistics) => [
    statistics.matchId,
    statistics.teamId,
    statistics.possession,
    statistics.shots,
    statistics.shotsOnTarget,
    statistics.yellowCards,
    statistics.redCards,
  ]);
  return insertInBatches(connection, insertStatisticsStatement, rows, batchSize);
}

export async function fetchMatchIdsByNaturalKey(connection) {
  const [rows] = await connection.query(
    'SELECT match_id AS matchId, match_date AS matchDate, home_team_id AS homeTeamId FROM football_match',
  );
  return new Map(rows.map((row) => [buildMatchKey(row.matchDate, row.homeTeamId), row.matchId]));
}
