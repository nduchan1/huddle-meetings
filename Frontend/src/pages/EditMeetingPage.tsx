import { useNavigate, useParams } from 'react-router'
import { updateMeeting } from '../api/meetings'
import { ErrorBanner } from '../components/ErrorBanner'
import { MeetingForm } from '../components/MeetingForm'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { useMeeting } from '../hooks/useMeeting'
import { usePageTitle } from '../hooks/usePageTitle'
import { useTeams } from '../hooks/useTeams'
import { useToast } from '../hooks/useToast'
import { toInputValue } from '../lib/datetime'
import type { MeetingFormValues, MeetingInput } from '../types'
import { NotFoundPage } from './NotFoundPage'

const MEETING_ID_PATTERN = /^[1-9]\d*$/

function FormSkeleton() {
  return (
    <div className="card form-card" aria-busy="true" aria-label="Loading meeting">
      <div className="form-grid">
        <Skeleton height={42} className="field--full" />
        <Skeleton height={42} />
        <Skeleton height={42} />
        <Skeleton height={42} className="field--full" />
        <Skeleton height={96} className="field--full" />
      </div>
    </div>
  )
}

export function EditMeetingPage() {
  const params = useParams()
  const id = MEETING_ID_PATTERN.test(params.id ?? '') ? Number(params.id) : null
  const { meeting, loading, error, notFound, reload } = useMeeting(id)
  const { teams, loading: teamsLoading, error: teamsError, reload: reloadTeams } = useTeams()
  const navigate = useNavigate()
  const toast = useToast()
  usePageTitle('Edit meeting')

  if (notFound) {
    return (
      <NotFoundPage title="Meeting not found" description="This meeting does not exist or has already been deleted." />
    )
  }

  const handleSubmit = async (input: MeetingInput) => {
    if (meeting === null) return
    await updateMeeting(meeting.id, input)
    toast.success('Meeting updated')
    navigate(`/meetings?team=${input.teamId}`)
  }

  const initialValues: MeetingFormValues | null =
    meeting === null
      ? null
      : {
          teamId: String(meeting.teamId),
          startTime: toInputValue(new Date(meeting.startTime)),
          endTime: toInputValue(new Date(meeting.endTime)),
          room: meeting.room,
          description: meeting.description,
        }

  return (
    <div className="form-page">
      <PageHeader
        eyebrow={meeting?.teamName ?? 'Meeting'}
        title="Edit meeting"
        description={meeting ? meeting.description : 'Update the details of this meeting.'}
      />
      {teamsError && <ErrorBanner message={teamsError} onRetry={reloadTeams} />}
      {loading && <FormSkeleton />}
      {error && <ErrorBanner message={error} onRetry={reload} />}
      {meeting !== null && initialValues !== null && (
        <MeetingForm
          key={meeting.id}
          mode="edit"
          teams={teams}
          teamsLoading={teamsLoading}
          initialValues={initialValues}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
