import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { createMeeting } from '../api/meetings'
import { ErrorBanner } from '../components/ErrorBanner'
import { MeetingForm } from '../components/MeetingForm'
import { PageHeader } from '../components/PageHeader'
import { usePageTitle } from '../hooks/usePageTitle'
import { useTeams } from '../hooks/useTeams'
import { useToast } from '../hooks/useToast'
import { addMinutes, nextFullHour, toInputValue } from '../lib/datetime'
import type { MeetingFormValues, MeetingInput } from '../types'

const TEAM_ID_PATTERN = /^[1-9]\d*$/

export function NewMeetingPage() {
  usePageTitle('New meeting')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { teams, loading: teamsLoading, error: teamsError, reload } = useTeams()

  const teamParam = searchParams.get('team') ?? ''
  const initialValues = useMemo<MeetingFormValues>(() => {
    const start = nextFullHour()
    return {
      teamId: TEAM_ID_PATTERN.test(teamParam) ? teamParam : '',
      startTime: toInputValue(start),
      endTime: toInputValue(addMinutes(start, 60)),
      room: '',
      description: '',
    }
  }, [teamParam])

  const handleSubmit = async (input: MeetingInput) => {
    await createMeeting(input)
    toast.success('Meeting created')
    navigate(`/meetings?team=${input.teamId}`)
  }

  return (
    <div className="form-page">
      <PageHeader
        eyebrow="Schedule"
        title="New meeting"
        description="Add a meeting to a team's calendar. Times are shown in your local time zone."
      />
      {teamsError && <ErrorBanner message={teamsError} onRetry={reload} />}
      <MeetingForm
        key={teamParam}
        mode="create"
        teams={teams}
        teamsLoading={teamsLoading}
        initialValues={initialValues}
        submitLabel="Create meeting"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
