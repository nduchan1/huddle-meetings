import { query } from '../db.js';
import type { Team } from '../types.js';

export async function listTeams(): Promise<Team[]> {
  return query<Team>('SELECT id, name FROM teams ORDER BY id');
}

export async function teamExists(id: number): Promise<boolean> {
  const rows = await query<{ id: number }>('SELECT id FROM teams WHERE id = $1', [id]);
  return rows.length > 0;
}
