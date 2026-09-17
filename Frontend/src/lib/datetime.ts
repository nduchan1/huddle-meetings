import type { MeetingStatus } from '../types'

const MINUTE = 60_000

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })

const pad = (value: number): string => String(value).padStart(2, '0')

/** Date -> "YYYY-MM-DDTHH:mm" in the local zone (the value of a datetime-local input). */
export function toInputValue(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

/** "YYYY-MM-DDTHH:mm" (local wall-clock) -> Date, or null when empty or not a valid date-time. */
export function fromInputValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

/** "Tue, 22 Sept 2026, 09:30" */
export function formatDateTime(value: Date | string): string {
  const date = toDate(value)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormat.format(date)
}

export type DateTimeRangeParts = {
  /** "Tue, 22 Sept 2026, 09:30" */
  start: string
  /** "10:30" when the meeting ends on the same day, otherwise the full end date and time */
  end: string
  /** What goes between the two parts */
  separator: string
}

/** The two halves of a range, so each instant can get its own <time> element. */
export function formatDateTimeRangeParts(start: Date | string, end: Date | string): DateTimeRangeParts | null {
  const from = toDate(start)
  const to = toDate(end)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null
  if (isSameLocalDay(from, to) && to >= from) {
    return { start: dateTimeFormat.format(from), end: timeFormat.format(to), separator: '–' }
  }
  return { start: dateTimeFormat.format(from), end: dateTimeFormat.format(to), separator: ' → ' }
}

/** Same day: "Tue, 22 Sept 2026, 09:30–10:30"; otherwise "<start> → <end>". */
export function formatDateTimeRange(start: Date | string, end: Date | string): string {
  const parts = formatDateTimeRangeParts(start, end)
  return parts === null ? '—' : `${parts.start}${parts.separator}${parts.end}`
}

/** Whole minutes between two instants as "1h 30m", "45m", "2h", "2d 3h" or "0m"; "—" when not computable. */
export function formatDuration(start: Date | string, end: Date | string): string {
  const minutes = Math.round((toDate(end).getTime() - toDate(start).getTime()) / MINUTE)
  if (!Number.isFinite(minutes) || minutes < 0) return '—'
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const rest = minutes % 60
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (rest > 0) parts.push(`${rest}m`)
  return parts.length > 0 ? parts.join(' ') : '0m'
}

/** A meeting is upcoming until its start has passed; from then on it counts as past. */
export function getMeetingStatus(startTime: string, now: number): MeetingStatus {
  return Date.parse(startTime) > now ? 'upcoming' : 'past'
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE)
}

/** The next full hour after the given moment, e.g. 14:23 -> 15:00. */
export function nextFullHour(from: Date = new Date()): Date {
  const next = new Date(from)
  next.setMinutes(0, 0, 0)
  next.setHours(next.getHours() + 1)
  return next
}

/** Truncates a moment to the start of its minute so two times can be compared minute by minute. */
export function startOfMinute(date: Date): number {
  return Math.floor(date.getTime() / MINUTE) * MINUTE
}
