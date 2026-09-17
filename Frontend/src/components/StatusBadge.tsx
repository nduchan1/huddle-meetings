import type { MeetingStatus } from '../types'
import { CalendarIcon, CheckIcon } from './Icons'

const LABELS: Record<MeetingStatus, string> = { upcoming: 'Upcoming', past: 'Past' }

export function StatusBadge({ status }: { status: MeetingStatus }) {
  const StatusIcon = status === 'upcoming' ? CalendarIcon : CheckIcon
  return (
    <span className={`badge badge--${status}`}>
      <StatusIcon size={14} />
      {LABELS[status]}
    </span>
  )
}
