-- Pregunta 3 ¿Qué equipos recibieron tarjetas rojas en la temporada 20/21 desde febrero de ese mismo año?

SELECT m.match_date, t.name AS team, st.red_cards
FROM football_match m
JOIN season s ON s.season_id = m.season_id
JOIN team_match_stats st ON st.match_id = m.match_id
JOIN team t ON t.team_id = st.team_id
WHERE s.label = '20/21'
  AND st.red_cards >= 1
  AND m.match_date >= '2021-02-01'
ORDER BY m.match_date, t.name;