-- Pregunta 2 ¿Qué equipos locales lograron goleadas de seis o mas goles de diferencia?

SELECT m.match_date, t.name AS home_team, m.home_goals, m.away_goals
FROM football_match m
JOIN team t ON t.team_id = m.home_team_id
WHERE m.home_goals >= m.away_goals + 6
ORDER BY m.match_date;