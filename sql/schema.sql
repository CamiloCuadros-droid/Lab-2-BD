CREATE DATABASE football_lab
  CHARACTER SET utf8mb4;
USE football_lab;

CREATE TABLE season (
  season_id TINYINT UNSIGNED
    AUTO_INCREMENT PRIMARY KEY,
  label CHAR(5) NOT NULL UNIQUE
);

CREATE TABLE team (
  team_id SMALLINT UNSIGNED
    AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE football_match (
  match_id SMALLINT UNSIGNED
    AUTO_INCREMENT PRIMARY KEY,
  season_id TINYINT UNSIGNED NOT NULL,
  match_date DATE NOT NULL,
  home_team_id SMALLINT UNSIGNED NOT NULL,
  away_team_id SMALLINT UNSIGNED NOT NULL,
  home_goals TINYINT UNSIGNED NOT NULL,
  away_goals TINYINT UNSIGNED NOT NULL,
  CONSTRAINT fk_match_season
    FOREIGN KEY (season_id)
    REFERENCES season (season_id),
  CONSTRAINT fk_match_home_team
    FOREIGN KEY (home_team_id)
    REFERENCES team (team_id),
  CONSTRAINT fk_match_away_team
    FOREIGN KEY (away_team_id)
    REFERENCES team (team_id),
  CONSTRAINT uq_match_date_home_team
    UNIQUE (match_date, home_team_id),
  CONSTRAINT ck_match_distinct_teams
    CHECK (home_team_id <> away_team_id)
);

CREATE TABLE team_match_stats (
  match_id SMALLINT UNSIGNED NOT NULL,
  team_id SMALLINT UNSIGNED NOT NULL,
  possession DECIMAL(4,1) NOT NULL,
  shots TINYINT UNSIGNED NOT NULL,
  shots_on_target TINYINT UNSIGNED NOT NULL,
  yellow_cards TINYINT UNSIGNED NOT NULL,
  red_cards TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (match_id, team_id),
  CONSTRAINT fk_stats_match
    FOREIGN KEY (match_id)
    REFERENCES football_match (match_id),
  CONSTRAINT fk_stats_team
    FOREIGN KEY (team_id)
    REFERENCES team (team_id),
  CONSTRAINT ck_stats_possession
    CHECK (possession BETWEEN 0 AND 100)
);
