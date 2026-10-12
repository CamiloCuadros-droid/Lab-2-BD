-- Pregunta 4 ¿En qué temporada hubo más tarjetas rojas (sumando ambos equipos) y coincide con la de más goles?
SELECT s.label AS season,
       COUNT(*) AS matches_played,
       SUM(r.red_cards) AS total_red_cards,
       SUM(m.home_goals + m.away_goals) AS total_goals,
       ROUND(1.0 * SUM(r.red_cards) / COUNT(*), 3) AS red_cards_per_match,
       ROUND(1.0 * SUM(m.home_goals + m.away_goals) / COUNT(*), 2) AS goals_per_match
FROM football_match m
JOIN season s ON s.season_id = m.season_id
JOIN (
  SELECT match_id, SUM(red_cards) AS red_cards
  FROM team_match_stats
  GROUP BY match_id
) r ON r.match_id = m.match_id
GROUP BY s.season_id, s.label
ORDER BY total_red_cards DESC;