import type { Request, Response } from 'express';
import { notFound, validationError } from '../errors.js';
import * as meetingsService from '../services/meetings.service.js';
import { teamExists } from '../services/teams.service.js';
import type { MeetingInput } from '../types.js';
import { validateMeetingInput, type MeetingMode } from '../validation/meeting.js';
import { parseId } from '../validation/params.js';

// Field validation and the team existence check are reported together in one response
async function readMeetingInput(body: unknown, mode: MeetingMode): Promise<MeetingInput> {
  const { input, fields, teamId } = validateMeetingInput(body, mode);
  if (teamId !== null && !(await teamExists(teamId))) {
    fields.teamId = 'Team does not exist';
  }
  if (input === null || Object.keys(fields).length > 0) {
    throw validationError(fields);
  }
  return input;
}

export async function getMeeting(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id, 'meeting');
  const meeting = await meetingsService.getById(id);
  if (!meeting) {
    throw notFound('Meeting not found');
  }
  res.json(meeting);
}

export async function createMeeting(req: Request, res: Response): Promise<void> {
  const input = await readMeetingInput(req.body, 'create');
  const meeting = await meetingsService.create(input);
  res.status(201).json(meeting);
}

export async function updateMeeting(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id, 'meeting');
  const input = await readMeetingInput(req.body, 'update');
  const meeting = await meetingsService.update(id, input);
  if (!meeting) {
    throw notFound('Meeting not found');
  }
  res.json(meeting);
}

export async function deleteMeeting(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id, 'meeting');
  if (!(await meetingsService.remove(id))) {
    throw notFound('Meeting not found');
  }
  res.status(204).end();
}
