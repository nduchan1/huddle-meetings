import { formatDateTimeRangeParts, getMeetingStatus } from '../lib/datetime'
import type { Meeting } from '../types'
import { Button } from './Button'
import { DurationPill } from './DurationPill'
import { CalendarIcon, EditIcon, PinIcon, TrashIcon } from './Icons'
import { StatusBadge } from './StatusBadge'

type Props = {
  meeting: Meeting
  now: number
  onDelete: (meeting: Meeting) => void
}

export function MeetingCard({ meeting, now, onDelete }: Props) {
  const status = getMeetingStatus(meeting.startTime, now)
  const titleId = `meeting-${meeting.id}-title`
  const when = formatDateTimeRangeParts(meeting.startTime, meeting.endTime)

  return (
    <article className={`card card--hover meeting-card meeting-card--${status}`} aria-labelledby={titleId}>
      <div className="meeting-card__top">
        <StatusBadge status={status} />
        <DurationPill start={meeting.startTime} end={meeting.endTime} />
      </div>
      <h3 id={titleId} className="meeting-card__title">
        {meeting.description}
      </h3>
      <ul className="meeting-card__meta">
        <li className="meeting-card__meta-row">
          <PinIcon />
          <span>
            <span className="visually-hidden">Room: </span>
            {meeting.room}
          </span>
        </li>
        <li className="meeting-card__meta-row">
          <CalendarIcon />
          <span>
            <span className="visually-hidden">When: </span>
            {when === null ? (
              '—'
            ) : (
              <>
                <time dateTime={meeting.startTime}>{when.start}</time>
                {when.separator}
                <time dateTime={meeting.endTime}>{when.end}</time>
              </>
            )}
          </span>
        </li>
      </ul>
      <div className="meeting-card__actions">
        <Button
          to={`/meetings/${meeting.id}/edit`}
          variant="secondary"
          className="btn--sm"
          icon={<EditIcon size={15} />}
          aria-label={`Edit ${meeting.description}`}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          className="btn--sm"
          icon={<TrashIcon size={15} />}
          onClick={() => onDelete(meeting)}
          aria-label={`Delete ${meeting.description}`}
        >
          Delete
        </Button>
      </div>
    </article>
  )
}
