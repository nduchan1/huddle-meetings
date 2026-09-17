-- Huddle - sample data
-- Run after schema.sql. Times are given with their Israel (Asia/Jerusalem) UTC offset.

INSERT INTO teams (name) VALUES
  ('UI Team'),
  ('Mobile Team'),
  ('React Team'),
  ('Backend Team'),
  ('QA Team'),
  ('DevOps Team');

INSERT INTO meetings (team_id, start_time, end_time, description, room) VALUES
  ((SELECT id FROM teams WHERE name = 'UI Team'), '2026-07-14 10:00:00+03', '2026-07-14 11:30:00+03', 'Design system tokens review', 'Blue Room'),
  ((SELECT id FROM teams WHERE name = 'UI Team'), '2026-08-25 14:00:00+03', '2026-08-25 15:00:00+03', 'Accessibility audit results', 'Green Room'),
  ((SELECT id FROM teams WHERE name = 'UI Team'), '2026-09-22 09:30:00+03', '2026-09-22 10:30:00+03', 'Q4 component roadmap', 'Blue Room'),
  ((SELECT id FROM teams WHERE name = 'UI Team'), '2026-11-10 13:00:00+02', '2026-11-10 14:30:00+02', 'Dark mode rollout planning', 'Skylight Room'),
  ((SELECT id FROM teams WHERE name = 'UI Team'), '2027-01-19 10:00:00+02', '2027-01-19 11:00:00+02', 'Design review: onboarding flow', 'Blue Room'),
  ((SELECT id FROM teams WHERE name = 'Mobile Team'), '2026-08-04 11:00:00+03', '2026-08-04 12:00:00+03', 'iOS 20 migration kickoff', 'New York Room'),
  ((SELECT id FROM teams WHERE name = 'Mobile Team'), '2026-09-15 15:00:00+03', '2026-09-15 16:30:00+03', 'Sprint 42 retrospective', 'Tel Aviv Room'),
  ((SELECT id FROM teams WHERE name = 'Mobile Team'), '2026-09-29 10:00:00+03', '2026-09-29 11:00:00+03', 'Push notifications redesign', 'New York Room'),
  ((SELECT id FROM teams WHERE name = 'Mobile Team'), '2026-12-02 09:00:00+02', '2026-12-02 12:00:00+02', 'Release 5.0 go/no-go', 'Large Board Room'),
  ((SELECT id FROM teams WHERE name = 'React Team'), '2026-07-28 09:00:00+03', '2026-07-28 10:00:00+03', 'React 19.3 upgrade plan', 'Blue Room'),
  ((SELECT id FROM teams WHERE name = 'React Team'), '2026-09-08 13:30:00+03', '2026-09-08 14:15:00+03', 'Hooks refactor sync', 'Focus Pod'),
  ((SELECT id FROM teams WHERE name = 'React Team'), '2026-10-06 11:00:00+03', '2026-10-06 12:30:00+03', 'State management deep dive', 'Tel Aviv Room'),
  ((SELECT id FROM teams WHERE name = 'React Team'), '2026-11-24 10:00:00+02', '2026-11-24 11:00:00+02', 'Performance budget review', 'Green Room'),
  ((SELECT id FROM teams WHERE name = 'React Team'), '2027-02-09 14:00:00+02', '2027-02-09 15:30:00+02', 'Server components workshop', 'Large Board Room'),
  ((SELECT id FROM teams WHERE name = 'Backend Team'), '2026-08-18 10:00:00+03', '2026-08-18 11:00:00+03', 'API versioning strategy', 'New York Room'),
  ((SELECT id FROM teams WHERE name = 'Backend Team'), '2026-09-10 16:00:00+03', '2026-09-10 17:00:00+03', 'Database index review', 'Focus Pod'),
  ((SELECT id FROM teams WHERE name = 'Backend Team'), '2026-10-13 09:00:00+03', '2026-10-13 10:30:00+03', 'PostgreSQL 18 upgrade checklist', 'Blue Room'),
  ((SELECT id FROM teams WHERE name = 'Backend Team'), '2026-12-15 13:00:00+02', '2026-12-15 14:00:00+02', 'Incident postmortem: queue backlog', 'Large Board Room'),
  ((SELECT id FROM teams WHERE name = 'QA Team'), '2026-07-21 14:00:00+03', '2026-07-21 15:00:00+03', 'Regression suite triage', 'Green Room'),
  ((SELECT id FROM teams WHERE name = 'QA Team'), '2026-09-16 10:00:00+03', '2026-09-16 11:30:00+03', 'Test automation roadmap', 'Tel Aviv Room'),
  ((SELECT id FROM teams WHERE name = 'QA Team'), '2026-10-20 15:00:00+03', '2026-10-20 16:00:00+03', 'Release 4.8 sign-off', 'Skylight Room'),
  ((SELECT id FROM teams WHERE name = 'QA Team'), '2027-01-12 11:00:00+02', '2027-01-12 12:00:00+02', 'Flaky tests review', 'Focus Pod'),
  ((SELECT id FROM teams WHERE name = 'DevOps Team'), '2026-08-11 09:00:00+03', '2026-08-11 10:00:00+03', 'CI pipeline cost review', 'Focus Pod'),
  ((SELECT id FROM teams WHERE name = 'DevOps Team'), '2026-09-17 13:00:00+03', '2026-09-17 14:00:00+03', 'On-call handover', 'New York Room'),
  ((SELECT id FROM teams WHERE name = 'DevOps Team'), '2026-09-24 10:00:00+03', '2026-09-24 12:00:00+03', 'Kubernetes cluster upgrade plan', 'Large Board Room'),
  ((SELECT id FROM teams WHERE name = 'DevOps Team'), '2026-11-03 14:00:00+02', '2026-11-03 15:00:00+02', 'Disaster recovery drill debrief', 'Blue Room'),
  ((SELECT id FROM teams WHERE name = 'DevOps Team'), '2027-02-23 10:00:00+02', '2027-02-23 10:45:00+02', 'Cloud budget Q1 review', 'Green Room');
