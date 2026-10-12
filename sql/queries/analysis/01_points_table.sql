-- Pregunta 1 ¿Qué equipo suma más puntos con 3 por victoria y 1 por empate, y es el mismo que más partidos ha jugado?

WITH team_results AS (
  SELECT home_team_id AS team_id,
         CASE WHEN home_goals > away_goals THEN 3
              WHEN home_goals = away_goals THEN 1
              ELSE 0 END AS points
  FROM football_match
  UNION ALL
  SELECT away_team_id,
         CASE WHEN away_goals > home_goals THEN 3
              WHEN away_goals = home_goals THEN 1
              ELSE 0 END
  FROM football_match
)

SELECT t.name AS team,
       COUNT(*) AS matches_played,
       SUM(r.points) AS total_points,
       ROUND(1.0 * SUM(r.points) / COUNT(*), 2) AS points_per_match,
       RANK() OVER (ORDER BY SUM(r.points) DESC) AS rank_by_points,
       RANK() OVER (ORDER BY COUNT(*) DESC) AS rank_by_matches
FROM team_results r
JOIN team t ON t.team_id = r.team_id
GROUP BY t.team_id, t.name
ORDER BY total_points DESC
LIMIT 10;