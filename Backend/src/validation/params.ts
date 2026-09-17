import { badRequest } from '../errors.js';

// Ids are PostgreSQL integer columns, so nothing beyond their range can exist
export const MAX_ID = 2_147_483_647;

const POSITIVE_INTEGER = /^[1-9]\d*$/;

export function parseId(value: unknown, label: 'team' | 'meeting'): number {
  const id = typeof value === 'string' && POSITIVE_INTEGER.test(value) ? Number(value) : NaN;
  if (Number.isNaN(id) || id > MAX_ID) {
    throw badRequest(`Invalid ${label} id`);
  }
  return id;
}
