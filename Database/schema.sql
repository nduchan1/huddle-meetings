-- Huddle - development team meetings
-- PostgreSQL schema (tested on PostgreSQL 18, hosted on Neon)
--
-- Run this file first, then seed.sql for sample data.
-- The DROP statements make the file safe to re-run on an existing database.

DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS teams;

-- Development teams in the company
CREATE TABLE teams (
  id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (length(btrim(name)) > 0)
);

-- Meetings, each belonging to exactly one team
CREATE TABLE meetings (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_id     INTEGER NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL CHECK (length(btrim(description)) > 0),
  room        TEXT NOT NULL CHECK (length(btrim(room)) > 0),
  CONSTRAINT meetings_end_after_start CHECK (end_time > start_time)
);

-- Meetings are always listed per team, ordered by start time
CREATE INDEX meetings_team_start_idx ON meetings (team_id, start_time);
