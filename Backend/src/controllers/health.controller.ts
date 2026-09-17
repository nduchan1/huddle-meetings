import type { Request, Response } from 'express';
import { query } from '../db.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const time = new Date().toISOString();
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'ok', time });
  } catch {
    res.status(503).json({ status: 'error', database: 'unreachable', time });
  }
}
