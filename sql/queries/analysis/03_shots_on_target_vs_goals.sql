-- Pregunta 3 ¿Qué equipo tuvo, en una misma temporada, la mayor diferencia entre tiros a puerta y goles anotados?
WITH team_season_totals AS (
  SELECT s.label AS season,
         t.name AS team,
         SUM(st.shots_on_target) AS shots_on_target,
         SUM(CASE WHEN st.team_id = m.home_team_id
                  THEN m.home_goals ELSE m.away_goals END) AS goals_scored
  FROM football_match m
  JOIN season s ON s.season_id = m.season_id
  JOIN team_match_stats st ON st.match_id = m.match_id
  JOIN team t ON t.team_id = st.team_id
  GROUP BY s.season_id, s.label, t.team_id, t.name
)
SELECT season,
       team,
       shots_on_target,
       goals_scored,
       shots_on_target - goals_scored AS shots_without_goal,
       ROUND(100.0 * goals_scored / shots_on_target, 1) AS conversion_pct
FROM team_season_totals
ORDER BY shots_without_goal DESC
LIMIT 10;