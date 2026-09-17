import { query } from '../db.js';
import { toMeeting, type Meeting, type MeetingInput, type MeetingRow } from '../types.js';

const MEETING_COLUMNS =
  'm.id, m.team_id, t.name AS team_name, m.start_time, m.end_time, m.description, m.room';

const SELECT_MEETINGS = `SELECT ${MEETING_COLUMNS} FROM meetings m JOIN teams t ON t.id = m.team_id`;

export async function listByTeam(teamId: number): Promise<Meeting[]> {
  const rows = await query<MeetingRow>(
    `${SELECT_MEETINGS} WHERE m.team_id = $1 ORDER BY m.start_time, m.id`,
    [teamId],
  );
  return rows.map(toMeeting);
}

export async function getById(id: number): Promise<Meeting | null> {
  const rows = await query<MeetingRow>(`${SELECT_MEETINGS} WHERE m.id = $1`, [id]);
  return rows.length > 0 ? toMeeting(rows[0]) : null;
}

export async function create(input: MeetingInput): Promise<Meeting> {
  const rows = await query<MeetingRow>(
    `WITH m AS (
       INSERT INTO meetings (team_id, start_time, end_time, description, room)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, team_id, start_time, end_time, description, room
     )
     SELECT ${MEETING_COLUMNS} FROM m JOIN teams t ON t.id = m.team_id`,
    [input.teamId, input.startTime, input.endTime, input.description, input.room],
  );
  return toMeeting(rows[0]);
}

export async function update(id: number, input: MeetingInput): Promise<Meeting | null> {
  const rows = await query<MeetingRow>(
    `WITH m AS (
       UPDATE meetings
       SET team_id = $1, start_time = $2, end_time = $3, description = $4, room = $5
       WHERE id = $6
       RETURNING id, team_id, start_time, end_time, description, room
     )
     SELECT ${MEETING_COLUMNS} FROM m JOIN teams t ON t.id = m.team_id`,
    [input.teamId, input.startTime, input.endTime, input.description, input.room, id],
  );
  return rows.length > 0 ? toMeeting(rows[0]) : null;
}

export async function remove(id: number): Promise<boolean> {
  const rows = await query<{ id: number }>('DELETE FROM meetings WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}
