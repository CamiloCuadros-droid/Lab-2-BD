import { RowValidationError } from './rowValidationError.js';

const maxUnsignedTinyInt = 255;
const maxPossession = 100;
const maxTeamNameLength = 60;
const seasonLabelPattern = /^\d{2}\/\d{2}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const integerPattern = /^\d+$/;
const decimalPattern = /^\d+(\.\d+)?$/;

const teamStatisticFields = [
  { property: 'possession', suffix: 'possession', pattern: decimalPattern, maxValue: maxPossession },
  { property: 'shots', suffix: 'shots', pattern: integerPattern, maxValue: maxUnsignedTinyInt },
  { property: 'shotsOnTarget', suffix: 'shots_on_target', pattern: integerPattern, maxValue: maxUnsignedTinyInt },
  { property: 'yellowCards', suffix: 'yellow_cards', pattern: integerPattern, maxValue: maxUnsignedTinyInt },
  { property: 'redCards', suffix: 'red_cards', pattern: integerPattern, maxValue: maxUnsignedTinyInt },
];

function readRequiredValue(rawRecord, columnName) {
  const rawValue = rawRecord[columnName];
  if (rawValue === undefined || rawValue === '') {
    throw new RowValidationError(`la columna ${columnName} está vacía o no existe`);
  }
  return rawValue;
}

function parseNumber(rawRecord, columnName, pattern, maxValue) {
  const rawValue = readRequiredValue(rawRecord, columnName);
  if (!pattern.test(rawValue)) {
    throw new RowValidationError(`la columna ${columnName} no contiene un número válido: "${rawValue}"`);
  }
  const parsedValue = Number(rawValue);
  if (parsedValue > maxValue) {
    throw new RowValidationError(`la columna ${columnName} excede el máximo permitido (${maxValue}): ${rawValue}`);
  }
  return parsedValue;
}

function parseTeamName(rawRecord, columnName) {
  const teamName = readRequiredValue(rawRecord, columnName);
  if (teamName.length > maxTeamNameLength) {
    throw new RowValidationError(`la columna ${columnName} excede ${maxTeamNameLength} caracteres`);
  }
  return teamName;
}

function parseSeasonLabel(rawRecord) {
  const seasonLabel = readRequiredValue(rawRecord, 'season');
  if (!seasonLabelPattern.test(seasonLabel)) {
    throw new RowValidationError(`la temporada "${seasonLabel}" no tiene formato AA/AA`);
  }
  return seasonLabel;
}

function parseMatchDate(rawRecord) {
  const matchDate = readRequiredValue(rawRecord, 'date');
  if (!datePattern.test(matchDate)) {
    throw new RowValidationError(`la fecha "${matchDate}" no tiene formato AAAA-MM-DD`);
  }
  const parsedDate = new Date(`${matchDate}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== matchDate) {
    throw new RowValidationError(`la fecha "${matchDate}" no existe en el calendario`);
  }
  return matchDate;
}

function parseTeamStatistics(rawRecord, sidePrefix) {
  return Object.fromEntries(
    teamStatisticFields.map(({ property, suffix, pattern, maxValue }) => [
      property,
      parseNumber(rawRecord, `${sidePrefix}_${suffix}`, pattern, maxValue),
    ]),
  );
}

export function parseMatchRecord(rawRecord) {
  const homeTeamName = parseTeamName(rawRecord, 'home_team');
  const awayTeamName = parseTeamName(rawRecord, 'away_team');
  if (homeTeamName === awayTeamName) {
    throw new RowValidationError('el equipo local y el visitante son el mismo');
  }
  return {
    seasonLabel: parseSeasonLabel(rawRecord),
    matchDate: parseMatchDate(rawRecord),
    homeTeamName,
    awayTeamName,
    homeGoals: parseNumber(rawRecord, 'goal_home_ft', integerPattern, maxUnsignedTinyInt),
    awayGoals: parseNumber(rawRecord, 'goal_away_ft', integerPattern, maxUnsignedTinyInt),
    homeStatistics: parseTeamStatistics(rawRecord, 'home'),
    awayStatistics: parseTeamStatistics(rawRecord, 'away'),
  };
}

export function validateMatchRecords(indexedRecords) {
  const validMatches = [];
  const rejectedRows = [];
  for (const { lineNumber, record } of indexedRecords) {
    try {
      validMatches.push(parseMatchRecord(record));
    } catch (error) {
      if (!(error instanceof RowValidationError)) {
        throw error;
      }
      rejectedRows.push({ lineNumber, reason: error.message });
    }
  }
  return { validMatches, rejectedRows };
}
