import { countRowsByTable, fetchTotalGoals } from '../repositories/tableStatisticsRepository.js';
import { collectDistinctSeasonLabels, collectDistinctTeamNames } from '../services/matchCollections.js';

const statisticsRowsPerMatch = 2;

function buildExpectedCounts(matches) {
  return {
    season: collectDistinctSeasonLabels(matches).length,
    team: collectDistinctTeamNames(matches).length,
    football_match: matches.length,
    team_match_stats: matches.length * statisticsRowsPerMatch,
  };
}

function sumGoals(matches) {
  return matches.reduce((total, match) => total + match.homeGoals + match.awayGoals, 0);
}

export async function verifyLoad(connection, matches) {
  const expectedCounts = buildExpectedCounts(matches);
  const actualCounts = await countRowsByTable(connection);
  const countChecks = Object.keys(expectedCounts).map((tableName) => ({
    label: `registros en ${tableName}`,
    expected: expectedCounts[tableName],
    actual: actualCounts[tableName],
  }));
  const goalsCheck = {
    label: 'goles totales',
    expected: sumGoals(matches),
    actual: await fetchTotalGoals(connection),
  };
  return [...countChecks, goalsCheck];
}

export function allChecksPassed(checks) {
  return checks.every((check) => check.expected === check.actual);
}

export function formatChecks(checks) {
  const lines = checks.map((check) => {
    const status = check.expected === check.actual ? 'OK' : 'DIFERENCIA';
    return `${check.label}: esperado ${check.expected}, cargado ${check.actual} [${status}]`;
  });
  const summary = allChecksPassed(checks) ? 'Verificación aprobada' : 'Verificación fallida';
  return [...lines, summary].join('\n');
}
