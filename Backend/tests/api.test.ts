import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Express } from 'express';
import { Client } from 'pg';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const testDatabaseUrl = process.env.TEST_DATABASE_URL ?? '';
const SCHEMA_FILE = fileURLToPath(new URL('../../Database/schema.sql', import.meta.url));
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const HOUR_MS = 60 * 60 * 1000;

type Seed = {
  teamA: number;
  teamB: number;
  pastMeetingId: number;
};

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * HOUR_MS).toISOString();
}

function futureMeeting(teamId: number, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    teamId,
    startTime: hoursFromNow(48),
    endTime: hoursFromNow(49),
    description: 'Roadmap sync',
    room: 'Blue Room',
    ...overrides,
  };
}

// Fresh schema plus two teams and three meetings (one past, two future) inserted out of order
async function resetDatabase(connectionString: string): Promise<Seed> {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query(await readFile(SCHEMA_FILE, 'utf8'));
    const teams = await client.query<{ id: number }>(
      "INSERT INTO teams (name) VALUES ('Platform Team'), ('Data Team') RETURNING id",
    );
    const [teamA, teamB] = teams.rows.map((row) => row.id);
    const meetings = await client.query<{ id: number }>(
      `INSERT INTO meetings (team_id, start_time, end_time, description, room) VALUES
         ($1, $2, $3, 'Architecture review', 'Green Room'),
         ($1, $4, $5, 'Sprint planning', 'Blue Room'),
         ($1, $6, $7, 'Retrospective', 'Focus Pod')
       RETURNING id`,
      [
        teamA,
        hoursFromNow(72),
        hoursFromNow(73),
        hoursFromNow(-48),
        hoursFromNow(-47),
        hoursFromNow(24),
        hoursFromNow(25),
      ],
    );
    return { teamA, teamB, pastMeetingId: meetings.rows[1].id };
  } finally {
    await client.end();
  }
}

describe.skipIf(testDatabaseUrl === '')('Huddle API', () => {
  let app: Express;
  let closePool: (() => Promise<void>) | undefined;
  let seed: Seed;

  beforeAll(async () => {
    process.env.DATABASE_URL = testDatabaseUrl;
    seed = await resetDatabase(testDatabaseUrl);
    ({ default: app } = await import('../src/app.js'));
    ({ closePool } = await import('../src/db.js'));
  });

  afterAll(async () => {
    await closePool?.();
  });

  describe('GET /', () => {
    it('describes the service', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ name: 'Huddle API', health: '/api/health' });
      expect(res.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('GET /api/health', () => {
    it('reports the database as reachable', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'ok', database: 'ok' });
      expect(res.body.time).toMatch(ISO_UTC);
    });
  });

  describe('GET /api/teams', () => {
    it('lists the teams ordered by id', async () => {
      const res = await request(app).get('/api/teams');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: seed.teamA, name: 'Platform Team' },
        { id: seed.teamB, name: 'Data Team' },
      ]);
    });
  });

  describe('GET /api/teams/:teamId/meetings', () => {
    it('lists every meeting of the team ordered by start time', async () => {
      const res = await request(app).get(`/api/teams/${seed.teamA}/meetings`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body.map((meeting: { description: string }) => meeting.description)).toEqual([
        'Sprint planning',
        'Retrospective',
        'Architecture review',
      ]);
      for (const meeting of res.body) {
        expect(meeting).toMatchObject({ teamId: seed.teamA, teamName: 'Platform Team' });
        expect(meeting.startTime).toMatch(ISO_UTC);
        expect(meeting.endTime).toMatch(ISO_UTC);
      }
    });

    it('returns an empty list for a team without meetings', async () => {
      const res = await request(app).get(`/api/teams/${seed.teamB}/meetings`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 404 for an unknown team', async () => {
      const res = await request(app).get('/api/teams/999999/meetings');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Team not found' });
    });

    it('returns 400 for an invalid team id', async () => {
      for (const id of ['abc', '0', '-1', '1.5', '2147483648']) {
        const res = await request(app).get(`/api/teams/${id}/meetings`);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid team id' });
      }
    });
  });

  describe('GET /api/meetings/:id', () => {
    it('returns a meeting with its team name', async () => {
      const res = await request(app).get(`/api/meetings/${seed.pastMeetingId}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: seed.pastMeetingId,
        teamId: seed.teamA,
        teamName: 'Platform Team',
        startTime: expect.stringMatching(ISO_UTC),
        endTime: expect.stringMatching(ISO_UTC),
        description: 'Sprint planning',
        room: 'Blue Room',
      });
    });

    it('returns 404 for an unknown meeting', async () => {
      const res = await request(app).get('/api/meetings/999999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Meeting not found' });
    });

    it('returns 400 for an invalid meeting id', async () => {
      for (const id of ['abc', '0', '2147483648']) {
        const res = await request(app).get(`/api/meetings/${id}`);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid meeting id' });
      }
    });
  });

  describe('POST /api/meetings', () => {
    it('creates a meeting and returns it with its team name', async () => {
      const input = futureMeeting(seed.teamA, { description: '  Roadmap sync  ', room: ' Blue Room ' });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        teamId: seed.teamA,
        teamName: 'Platform Team',
        startTime: input.startTime,
        endTime: input.endTime,
        description: 'Roadmap sync',
        room: 'Blue Room',
      });
      expect(res.body.startTime).toMatch(ISO_UTC);
    });

    it('normalises times given with a UTC offset', async () => {
      const input = futureMeeting(seed.teamB, {
        startTime: '2027-05-01T09:00:00+03:00',
        endTime: '2027-05-01T10:00:00+03:00',
      });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(201);
      expect(res.body.startTime).toBe('2027-05-01T06:00:00.000Z');
      expect(res.body.endTime).toBe('2027-05-01T07:00:00.000Z');
    });

    it('rejects an empty body with every required-field message', async () => {
      const res = await request(app).post('/api/meetings').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Validation failed',
        fields: {
          teamId: 'Team is required',
          startTime: 'Start time is required',
          endTime: 'End time is required',
          description: 'Description is required',
          room: 'Room is required',
        },
      });
    });

    it('rejects invalid values with the matching messages', async () => {
      const res = await request(app).post('/api/meetings').send({
        teamId: '1',
        startTime: 'yesterday',
        endTime: '2027-02-30T10:00:00.000Z',
        description: 'x'.repeat(1001),
        room: 'y'.repeat(101),
      });
      expect(res.status).toBe(400);
      expect(res.body.fields).toEqual({
        teamId: 'Team is required',
        startTime: 'Start time is invalid',
        endTime: 'End time is invalid',
        description: 'Description must be at most 1000 characters',
        room: 'Room must be at most 100 characters',
      });
    });

    it('rejects text containing NUL characters', async () => {
      const input = futureMeeting(seed.teamA, { description: 'Roadmap\0sync', room: 'Blue\0Room' });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(400);
      expect(res.body.fields).toEqual({
        description: 'Description contains invalid characters',
        room: 'Room contains invalid characters',
      });
    });

    it('rejects a start time in the past', async () => {
      const input = futureMeeting(seed.teamA, { startTime: hoursFromNow(-2), endTime: hoursFromNow(-1) });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(400);
      expect(res.body.fields).toEqual({ startTime: 'Start time cannot be in the past' });
    });

    it('accepts a start time a few seconds in the past', async () => {
      const startTime = new Date(Date.now() - 30_000).toISOString();
      const input = futureMeeting(seed.teamA, { startTime, endTime: hoursFromNow(1) });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(201);
      expect(res.body.startTime).toBe(startTime);
    });

    it('rejects an end time that is not after the start time', async () => {
      const startTime = hoursFromNow(48);
      const before = futureMeeting(seed.teamA, { startTime, endTime: hoursFromNow(47) });
      const same = futureMeeting(seed.teamA, { startTime, endTime: startTime });
      for (const input of [before, same]) {
        const res = await request(app).post('/api/meetings').send(input);
        expect(res.status).toBe(400);
        expect(res.body.fields).toEqual({ endTime: 'End time must be after the start time' });
      }
    });

    it('rejects an unknown team, including an id beyond the integer range', async () => {
      for (const teamId of [999999, 2147483648]) {
        const res = await request(app).post('/api/meetings').send(futureMeeting(teamId));
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Validation failed', fields: { teamId: 'Team does not exist' } });
      }
    });

    it('reports the unknown team together with the other field errors', async () => {
      const res = await request(app)
        .post('/api/meetings')
        .send({ teamId: 999999, startTime: hoursFromNow(48), endTime: hoursFromNow(49) });
      expect(res.status).toBe(400);
      expect(res.body.fields).toEqual({
        teamId: 'Team does not exist',
        description: 'Description is required',
        room: 'Room is required',
      });
    });

    it('ignores unknown keys', async () => {
      const input = futureMeeting(seed.teamA, { id: 1, teamName: 'Nope', extra: true });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(201);
      expect(res.body.teamName).toBe('Platform Team');
      expect(res.body.id).not.toBe(1);
    });

    it('rejects a malformed JSON body', async () => {
      const res = await request(app)
        .post('/api/meetings')
        .set('Content-Type', 'application/json')
        .send('{"teamId": 1,');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Malformed JSON body' });
    });

    it('rejects a body larger than the configured limit', async () => {
      const input = futureMeeting(seed.teamA, { description: 'x'.repeat(120_000) });
      const res = await request(app).post('/api/meetings').send(input);
      expect(res.status).toBe(413);
      expect(res.body).toEqual({ error: 'Request entity too large' });
    });
  });

  describe('PUT /api/meetings/:id', () => {
    it('updates a meeting, including one that already happened', async () => {
      const input = futureMeeting(seed.teamB, {
        startTime: hoursFromNow(-30),
        endTime: hoursFromNow(-29),
        description: 'Sprint planning (moved)',
        room: 'Green Room',
      });
      const res = await request(app).put(`/api/meetings/${seed.pastMeetingId}`).send(input);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: seed.pastMeetingId,
        teamId: seed.teamB,
        teamName: 'Data Team',
        startTime: input.startTime,
        endTime: input.endTime,
        description: 'Sprint planning (moved)',
        room: 'Green Room',
      });
    });

    it('rejects an end time before the start time', async () => {
      const input = futureMeeting(seed.teamA, { startTime: hoursFromNow(10), endTime: hoursFromNow(9) });
      const res = await request(app).put(`/api/meetings/${seed.pastMeetingId}`).send(input);
      expect(res.status).toBe(400);
      expect(res.body.fields).toEqual({ endTime: 'End time must be after the start time' });
    });

    it('validates the body before looking the meeting up', async () => {
      const res = await request(app).put('/api/meetings/999999').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('returns 404 for an unknown meeting', async () => {
      const res = await request(app).put('/api/meetings/999999').send(futureMeeting(seed.teamA));
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Meeting not found' });
    });

    it('returns 400 for an invalid meeting id', async () => {
      const res = await request(app).put('/api/meetings/abc').send(futureMeeting(seed.teamA));
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid meeting id' });
    });
  });

  describe('DELETE /api/meetings/:id', () => {
    it('deletes a meeting so it can no longer be fetched', async () => {
      const created = await request(app).post('/api/meetings').send(futureMeeting(seed.teamA));
      expect(created.status).toBe(201);

      const deleted = await request(app).delete(`/api/meetings/${created.body.id}`);
      expect(deleted.status).toBe(204);
      expect(deleted.text).toBe('');

      const fetched = await request(app).get(`/api/meetings/${created.body.id}`);
      expect(fetched.status).toBe(404);
      expect(fetched.body).toEqual({ error: 'Meeting not found' });
    });

    it('returns 404 for an unknown meeting', async () => {
      const res = await request(app).delete('/api/meetings/999999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Meeting not found' });
    });

    it('returns 400 for an invalid meeting id', async () => {
      const res = await request(app).delete('/api/meetings/abc');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid meeting id' });
    });
  });

  describe('unknown routes', () => {
    it('return 404 with a JSON body', async () => {
      const res = await request(app).get('/api/rooms');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Route not found' });
    });

    it('cover unsupported methods on known paths', async () => {
      const res = await request(app).post('/api/teams').send({ name: 'Nope' });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Route not found' });
    });
  });

  describe('CORS', () => {
    it('answers the preflight for an allowed origin', async () => {
      const res = await request(app)
        .options('/api/meetings/1')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'DELETE');
      expect(res.status).toBe(204);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(res.headers['access-control-allow-methods']).toContain('DELETE');
    });

    it('does not allow an unknown origin', async () => {
      const res = await request(app).get('/api/teams').set('Origin', 'https://evil.example');
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
