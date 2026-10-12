export function collectDistinctSeasonLabels(matches) {
  return [...new Set(matches.map((match) => match.seasonLabel))];
}

export function collectDistinctTeamNames(matches) {
  return [...new Set(matches.flatMap((match) => [match.homeTeamName, match.awayTeamName]))];
}
