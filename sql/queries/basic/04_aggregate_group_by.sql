-- Pregunta 4 ¿Cuántos partidos hay por temporada y cual es su promedio de goles por partido?

SELECT s.label AS season,
       COUNT(*) AS matches_played,
       ROUND(AVG(m.home_goals + m.away_goals), 2) AS avg_goals_per_match
FROM football_match m
JOIN season s ON s.season_id = m.season_id
GROUP BY s.season_id, s.label
ORDER BY s.label;