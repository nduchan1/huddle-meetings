import * as z from 'zod';
import type { MeetingInput } from '../types.js';
import { MAX_ID } from './params.js';

export type MeetingMode = 'create' | 'update';

export type MeetingValidation = {
  // The clean input when every rule passed, otherwise null
  input: MeetingInput | null;
  // Field name to message; empty when the input is valid
  fields: Record<string, string>;
  // The team id whenever that field on its own is valid, so the caller can verify the team exists
  teamId: number | null;
};

// A form submitted right at the deadline is still accepted
const PAST_GRACE_MS = 60_000;

// PostgreSQL text columns cannot hold NUL characters
const NO_NUL = /^[^\0]*$/;

function isoDateTime(label: string) {
  return z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, { error: `${label} is required` })
    .pipe(z.iso.datetime({ offset: true, error: `${label} is invalid` }));
}

function text(label: string, maxLength: number) {
  return z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, { error: `${label} is required` })
    .max(maxLength, { error: `${label} must be at most ${maxLength} characters` })
    .regex(NO_NUL, { error: `${label} contains invalid characters` });
}

const teamIdSchema = z
  .int({ error: 'Team is required' })
  .positive({ error: 'Team is required' })
  .max(MAX_ID, { error: 'Team does not exist' });
const startTimeSchema = isoDateTime('Start time');
const endTimeSchema = isoDateTime('End time');
const descriptionSchema = text('Description', 1000);
const roomSchema = text('Room', 100);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Parses one field; on failure records its first issue and returns undefined
function parseField<T>(schema: z.ZodType<T>, value: unknown, key: string, fields: Record<string, string>): T | undefined {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  fields[key] = result.error.issues[0].message;
  return undefined;
}

export function validateMeetingInput(body: unknown, mode: MeetingMode): MeetingValidation {
  const source = isPlainObject(body) ? body : {};
  const fields: Record<string, string> = {};

  const teamId = parseField(teamIdSchema, source.teamId, 'teamId', fields);
  const startTime = parseField(startTimeSchema, source.startTime, 'startTime', fields);
  const endTime = parseField(endTimeSchema, source.endTime, 'endTime', fields);
  const description = parseField(descriptionSchema, source.description, 'description', fields);
  const room = parseField(roomSchema, source.room, 'room', fields);

  const start = startTime === undefined ? undefined : new Date(startTime);
  const end = endTime === undefined ? undefined : new Date(endTime);

  // Cross-field rules only apply once the times involved are valid on their own
  if (start !== undefined && end !== undefined && end.getTime() <= start.getTime()) {
    fields.endTime = 'End time must be after the start time';
  }
  if (mode === 'create' && start !== undefined && start.getTime() < Date.now() - PAST_GRACE_MS) {
    fields.startTime = 'Start time cannot be in the past';
  }

  const valid =
    Object.keys(fields).length === 0 &&
    teamId !== undefined &&
    start !== undefined &&
    end !== undefined &&
    description !== undefined &&
    room !== undefined;

  return {
    input: valid
      ? { teamId, startTime: start.toISOString(), endTime: end.toISOString(), description, room }
      : null,
    fields,
    teamId: teamId ?? null,
  };
}
