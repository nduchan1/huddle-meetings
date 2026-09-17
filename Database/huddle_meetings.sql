--
-- PostgreSQL database dump
--

-- Dumped from database version 18.6 (6569466)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: meetings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meetings (
    id integer NOT NULL,
    team_id integer NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    description text NOT NULL,
    room text NOT NULL,
    CONSTRAINT meetings_description_check CHECK ((length(btrim(description)) > 0)),
    CONSTRAINT meetings_end_after_start CHECK ((end_time > start_time)),
    CONSTRAINT meetings_room_check CHECK ((length(btrim(room)) > 0))
);

--
-- Name: meetings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.meetings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.meetings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT teams_name_check CHECK ((length(btrim(name)) > 0))
);

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.teams ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (1, 1, '2026-07-14 07:00:00+00', '2026-07-14 08:30:00+00', 'Design system tokens review', 'Blue Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (2, 1, '2026-08-25 11:00:00+00', '2026-08-25 12:00:00+00', 'Accessibility audit results', 'Green Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (3, 1, '2026-09-22 06:30:00+00', '2026-09-22 07:30:00+00', 'Q4 component roadmap', 'Blue Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (4, 1, '2026-11-10 11:00:00+00', '2026-11-10 12:30:00+00', 'Dark mode rollout planning', 'Skylight Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (5, 1, '2027-01-19 08:00:00+00', '2027-01-19 09:00:00+00', 'Design review: onboarding flow', 'Blue Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (6, 2, '2026-08-04 08:00:00+00', '2026-08-04 09:00:00+00', 'iOS 20 migration kickoff', 'New York Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (7, 2, '2026-09-15 12:00:00+00', '2026-09-15 13:30:00+00', 'Sprint 42 retrospective', 'Tel Aviv Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (8, 2, '2026-09-29 07:00:00+00', '2026-09-29 08:00:00+00', 'Push notifications redesign', 'New York Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (9, 2, '2026-12-02 07:00:00+00', '2026-12-02 10:00:00+00', 'Release 5.0 go/no-go', 'Large Board Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (10, 3, '2026-07-28 06:00:00+00', '2026-07-28 07:00:00+00', 'React 19.3 upgrade plan', 'Blue Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (11, 3, '2026-09-08 10:30:00+00', '2026-09-08 11:15:00+00', 'Hooks refactor sync', 'Focus Pod');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (12, 3, '2026-10-06 08:00:00+00', '2026-10-06 09:30:00+00', 'State management deep dive', 'Tel Aviv Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (13, 3, '2026-11-24 08:00:00+00', '2026-11-24 09:00:00+00', 'Performance budget review', 'Green Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (14, 3, '2027-02-09 12:00:00+00', '2027-02-09 13:30:00+00', 'Server components workshop', 'Large Board Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (15, 4, '2026-08-18 07:00:00+00', '2026-08-18 08:00:00+00', 'API versioning strategy', 'New York Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (16, 4, '2026-09-10 13:00:00+00', '2026-09-10 14:00:00+00', 'Database index review', 'Focus Pod');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (17, 4, '2026-10-13 06:00:00+00', '2026-10-13 07:30:00+00', 'PostgreSQL 18 upgrade checklist', 'Blue Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (18, 4, '2026-12-15 11:00:00+00', '2026-12-15 12:00:00+00', 'Incident postmortem: queue backlog', 'Large Board Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (19, 5, '2026-07-21 11:00:00+00', '2026-07-21 12:00:00+00', 'Regression suite triage', 'Green Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (20, 5, '2026-09-16 07:00:00+00', '2026-09-16 08:30:00+00', 'Test automation roadmap', 'Tel Aviv Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (21, 5, '2026-10-20 12:00:00+00', '2026-10-20 13:00:00+00', 'Release 4.8 sign-off', 'Skylight Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (22, 5, '2027-01-12 09:00:00+00', '2027-01-12 10:00:00+00', 'Flaky tests review', 'Focus Pod');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (23, 6, '2026-08-11 06:00:00+00', '2026-08-11 07:00:00+00', 'CI pipeline cost review', 'Focus Pod');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (24, 6, '2026-09-17 10:00:00+00', '2026-09-17 11:00:00+00', 'On-call handover', 'New York Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (25, 6, '2026-09-24 07:00:00+00', '2026-09-24 09:00:00+00', 'Kubernetes cluster upgrade plan', 'Large Board Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (26, 6, '2026-11-03 12:00:00+00', '2026-11-03 13:00:00+00', 'Disaster recovery drill debrief', 'Blue Room');
INSERT INTO public.meetings (id, team_id, start_time, end_time, description, room) OVERRIDING SYSTEM VALUE VALUES (27, 6, '2027-02-23 08:00:00+00', '2027-02-23 08:45:00+00', 'Cloud budget Q1 review', 'Green Room');

--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.teams (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'UI Team');
INSERT INTO public.teams (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Mobile Team');
INSERT INTO public.teams (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'React Team');
INSERT INTO public.teams (id, name) OVERRIDING SYSTEM VALUE VALUES (4, 'Backend Team');
INSERT INTO public.teams (id, name) OVERRIDING SYSTEM VALUE VALUES (5, 'QA Team');
INSERT INTO public.teams (id, name) OVERRIDING SYSTEM VALUE VALUES (6, 'DevOps Team');

--
-- Name: meetings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meetings_id_seq', 28, true);

--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teams_id_seq', 6, true);

--
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);

--
-- Name: teams teams_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);

--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);

--
-- Name: meetings_team_start_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX meetings_team_start_idx ON public.meetings USING btree (team_id, start_time);

--
-- Name: meetings meetings_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--

