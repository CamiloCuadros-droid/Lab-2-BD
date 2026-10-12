-- Pregunta 2 ¿Qué equipo tiene la mejor posesión promedio cuando gana, y ganar con poca posesión es raro o común?

WITH team_wins AS (
  SELECT st.team_id, st.possession
  FROM football_match m
  JOIN team_match_stats st ON st.match_id = m.match_id
  WHERE (st.team_id = m.home_team_id AND m.home_goals > m.away_goals)
     OR (st.team_id = m.away_team_id AND m.away_goals > m.home_goals)
)
SELECT t.name AS team,
       COUNT(*) AS wins,
       ROUND(AVG(w.possession), 1) AS avg_possession_in_wins,
       ROUND(100.0 * SUM(CASE WHEN w.possession < 50 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_wins_below_50
FROM team_wins w
JOIN team t ON t.team_id = w.team_id
GROUP BY t.team_id, t.name
ORDER BY avg_possession_in_wins DESC
LIMIT 10;

-- Parte 2
WITH team_wins AS (
  SELECT st.team_id, st.possession
  FROM football_match m
  JOIN team_match_stats st ON st.match_id = m.match_id
  WHERE (st.team_id = m.home_team_id AND m.home_goals > m.away_goals)
     OR (st.team_id = m.away_team_id AND m.away_goals > m.home_goals)
)
SELECT COUNT(*) AS total_wins,
       SUM(CASE WHEN possession < 50 THEN 1 ELSE 0 END) AS wins_below_50,
       ROUND(100.0 * SUM(CASE WHEN possession < 50 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_wins_below_50
FROM team_wins;