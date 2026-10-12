-- Pregunta 1 ¿Qué partidos de 2019 tuvieron seis o mas goles en total?

SELECT match_id, match_date, home_goals, away_goals
FROM football_match
WHERE match_date BETWEEN '2019-01-01' AND '2019-12-31'
  AND home_goals + away_goals >= 6
ORDER BY match_date, match_id;