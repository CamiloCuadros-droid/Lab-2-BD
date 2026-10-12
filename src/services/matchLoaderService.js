import { runInTransaction } from '../database/transaction.js';
import {
  buildMatchKey,
  fetchMatchIdsByNaturalKey,
  insertMatches,
  insertTeamStatistics,
} from '../repositories/matchRepository.js';
import { insertSeasons, insertTeams } from '../repositories/referenceRepository.js';
import { countRowsByTable } from '../repositories/tableStatisticsRepository.js';
import { collectDistinctSeasonLabels, collectDistinctTeamNames } from './matchCollections.js';

async function assertDatabaseIsEmpty(connection) {
  const rowCounts = await countRowsByTable(connection);
  const populatedTables = Object.keys(rowCounts).filter((tableName) => rowCounts[tableName] > 0);
  if (populatedTables.length > 0) {
    throw new Error(
      `Las tablas ${populatedTables.join(', ')} ya contienen datos. Recree la base de datos con sql/schema.sql antes de cargar`,
    );
  }
}

function buildMatchRecords(matches, seasonIds, teamIds) {
  return matches.map((match) => ({
    seasonId: seasonIds.get(match.seasonLabel),
    matchDate: match.matchDate,
    homeTeamId: teamIds.get(match.homeTeamName),
    awayTeamId: teamIds.get(match.awayTeamName),
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
  }));
}

function buildStatisticsRecords(matches, teamIds, matchIds) {
  return matches.flatMap((match) => {
    const homeTeamId = teamIds.get(match.homeTeamName);
    const awayTeamId = teamIds.get(match.awayTeamName);
    const matchId = matchIds.get(buildMatchKey(match.matchDate, homeTeamId));
    return [
      { matchId, teamId: homeTeamId, ...match.homeStatistics },
      { matchId, teamId: awayTeamId, ...match.awayStatistics },
    ];
  });
}

export async function loadMatches(connection, matches, batchSize) {
  await assertDatabaseIsEmpty(connection);
  await runInTransaction(connection, async () => {
    const seasonIds = await insertSeasons(connection, collectDistinctSeasonLabels(matches));
    const teamIds = await insertTeams(connection, collectDistinctTeamNames(matches));
    await insertMatches(connection, buildMatchRecords(matches, seasonIds, teamIds), batchSize);
    const matchIds = await fetchMatchIdsByNaturalKey(connection);
    await insertTeamStatistics(
      connection,
      buildStatisticsRecords(matches, teamIds, matchIds),
      batchSize,
    );
  });
}
