import type { Request, Response } from 'express';
import { notFound } from '../errors.js';
import * as meetingsService from '../services/meetings.service.js';
import * as teamsService from '../services/teams.service.js';
import { parseId } from '../validation/params.js';

export async function listTeams(_req: Request, res: Response): Promise<void> {
  const teams = await teamsService.listTeams();
  res.json(teams);
}

export async function listTeamMeetings(req: Request, res: Response): Promise<void> {
  const teamId = parseId(req.params.teamId, 'team');
  if (!(await teamsService.teamExists(teamId))) {
    throw notFound('Team not found');
  }
  const meetings = await meetingsService.listByTeam(teamId);
  res.json(meetings);
}
