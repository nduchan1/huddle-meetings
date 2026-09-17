import { formatDuration } from '../lib/datetime'
import { ClockIcon } from './Icons'

type Props = { start: string; end: string }

export function DurationPill({ start, end }: Props) {
  return (
    <span className="pill">
      <ClockIcon size={14} />
      <span className="visually-hidden">Duration: </span>
      {formatDuration(start, end)}
    </span>
  )
}
