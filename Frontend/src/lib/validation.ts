import type { MeetingFormErrors, MeetingFormField, MeetingFormMode, MeetingFormValues } from '../types'
import { fromInputValue, startOfMinute } from './datetime'

export const ROOMS = [
  'Blue Room',
  'New York Room',
  'Large Board Room',
  'Green Room',
  'Tel Aviv Room',
  'Skylight Room',
  'Focus Pod',
] as const

export const ROOM_MAX_LENGTH = 100
export const DESCRIPTION_MAX_LENGTH = 1000

/** Fields in the order they appear in the form; used to focus the first invalid one. */
export const FIELD_ORDER: MeetingFormField[] = ['teamId', 'startTime', 'endTime', 'room', 'description']

/** Same rules and messages as the API, so client and server validation always agree. */
export function validateMeetingForm(
  values: MeetingFormValues,
  mode: MeetingFormMode,
  now: Date = new Date(),
): MeetingFormErrors {
  const errors: MeetingFormErrors = {}

  if (!/^[1-9]\d*$/.test(values.teamId)) errors.teamId = 'Team is required'

  const start = fromInputValue(values.startTime)
  if (values.startTime === '') errors.startTime = 'Start time is required'
  else if (start === null) errors.startTime = 'Start time is invalid'

  const end = fromInputValue(values.endTime)
  if (values.endTime === '') errors.endTime = 'End time is required'
  else if (end === null) errors.endTime = 'End time is invalid'

  if (start !== null && end !== null && end.getTime() <= start.getTime()) {
    errors.endTime = 'End time must be after the start time'
  }
  if (mode === 'create' && start !== null && startOfMinute(start) < startOfMinute(now)) {
    errors.startTime = 'Start time cannot be in the past'
  }

  const room = values.room.trim()
  if (room === '') errors.room = 'Room is required'
  else if (room.length > ROOM_MAX_LENGTH) errors.room = `Room must be at most ${ROOM_MAX_LENGTH} characters`

  const description = values.description.trim()
  if (description === '') errors.description = 'Description is required'
  else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`
  }

  return errors
}

export function firstInvalidField(errors: MeetingFormErrors): MeetingFormField | undefined {
  return FIELD_ORDER.find((field) => errors[field] !== undefined)
}
