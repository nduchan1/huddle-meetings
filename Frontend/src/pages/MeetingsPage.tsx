import { useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { getErrorMessage } from '../api/client'
import { deleteMeeting } from '../api/meetings'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { ErrorBanner } from '../components/ErrorBanner'
import { CalendarIcon, PlusIcon, UsersIcon } from '../components/Icons'
import { MeetingCard } from '../components/MeetingCard'
import { PageHeader } from '../components/PageHeader'
import { MeetingCardSkeleton } from '../components/Skeleton'
import { TeamSelect } from '../components/TeamSelect'
import { useMeetings } from '../hooks/useMeetings'
import { useNow } from '../hooks/useNow'
import { usePageTitle } from '../hooks/usePageTitle'
import { useTeams } from '../hooks/useTeams'
import { useToast } from '../hooks/useToast'
import { formatDateTimeRange, getMeetingStatus } from '../lib/datetime'
import type { Meeting } from '../types'

const TEAM_ID_PATTERN = /^[1-9]\d*$/

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export function MeetingsPage() {
  usePageTitle('Meetings')
  const [searchParams, setSearchParams] = useSearchParams()
  const teamParam = searchParams.get('team') ?? ''
  const teamId = TEAM_ID_PATTERN.test(teamParam) ? Number(teamParam) : null

  const { teams, loading: teamsLoading, error: teamsError, reload: reloadTeams } = useTeams()
  const { meetings, loading, error, reload, removeMeeting } = useMeetings(teamId)
  const now = useNow()
  const toast = useToast()
  const [pendingDelete, setPendingDelete] = useState<Meeting | null>(null)
  const [deleting, setDeleting] = useState(false)

  const selectedTeam = teams.find((team) => team.id === teamId)
  const newMeetingTo = teamId === null ? '/meetings/new' : `/meetings/new?team=${teamId}`

  const selectTeam = (value: string) => {
    setSearchParams(value ? { team: value } : {})
  }

  const confirmDelete = async () => {
    if (pendingDelete === null) return
    setDeleting(true)
    try {
      await deleteMeeting(pendingDelete.id)
      removeMeeting(pendingDelete.id)
      toast.success('Meeting deleted')
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError))
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  const upcoming = (meetings ?? []).filter((meeting) => getMeetingStatus(meeting.startTime, now) === 'upcoming')
  const past = (meetings ?? []).filter((meeting) => getMeetingStatus(meeting.startTime, now) === 'past').reverse()

  let content: ReactNode
  if (teamId === null) {
    content = (
      <EmptyState
        icon={<UsersIcon size={26} />}
        title="Pick a team to see its meetings"
        description="Choose a development team above to browse its upcoming and past meetings."
      />
    )
  } else if (loading) {
    content = (
      <div className="meeting-grid" aria-busy="true" aria-label="Loading meetings">
        <MeetingCardSkeleton />
        <MeetingCardSkeleton />
        <MeetingCardSkeleton />
      </div>
    )
  } else if (error) {
    content = <ErrorBanner message={error} onRetry={reload} />
  } else if (meetings !== null && meetings.length === 0) {
    content = (
      <EmptyState
        icon={<CalendarIcon size={26} />}
        title="No meetings yet"
        description={`${selectedTeam?.name ?? 'This team'} has nothing on the calendar.`}
        action={
          <Button to={newMeetingTo} icon={<PlusIcon />}>
            Schedule the first meeting
          </Button>
        }
      />
    )
  } else if (meetings !== null) {
    content = (
      <>
        <p className="summary">
          <strong>{plural(meetings.length, 'meeting')}</strong>
          <span className="summary__dot"> · </span>
          <span className="summary__upcoming">{upcoming.length} upcoming</span>
          <span className="summary__dot"> · </span>
          <span className="summary__past">{past.length} past</span>
        </p>
        {upcoming.length > 0 && (
          <section className="meeting-section" aria-labelledby="upcoming-heading">
            <h2 id="upcoming-heading" className="meeting-section__title">
              Upcoming <span className="meeting-section__count">{upcoming.length}</span>
            </h2>
            <div className="meeting-grid">
              {upcoming.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} now={now} onDelete={setPendingDelete} />
              ))}
            </div>
          </section>
        )}
        {past.length > 0 && (
          <section className="meeting-section" aria-labelledby="past-heading">
            <h2 id="past-heading" className="meeting-section__title">
              Past <span className="meeting-section__count">{past.length}</span>
            </h2>
            <div className="meeting-grid">
              {past.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} now={now} onDelete={setPendingDelete} />
              ))}
            </div>
          </section>
        )}
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Teams"
        title="Meetings"
        description="Browse the meetings of each development team. Meetings still ahead come first, followed by the ones that already took place."
      />

      {teamsError && <ErrorBanner message={teamsError} onRetry={reloadTeams} />}

      <div className="card toolbar">
        <div className="field toolbar__field">
          <label className="field__label" htmlFor="team-filter">
            Development team
          </label>
          <TeamSelect
            id="team-filter"
            value={teamId === null ? '' : String(teamId)}
            teams={teams}
            loading={teamsLoading}
            disabled={teamsLoading}
            onChange={selectTeam}
          />
        </div>
        <Button to={newMeetingTo} icon={<PlusIcon />}>
          New meeting
        </Button>
      </div>

      {content}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete meeting?"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        {pendingDelete && (
          <>
            <p className="dialog__subject">{pendingDelete.description}</p>
            <p>{formatDateTimeRange(pendingDelete.startTime, pendingDelete.endTime)}</p>
            <p className="dialog__note">This cannot be undone.</p>
          </>
        )}
      </ConfirmDialog>
    </>
  )
}
