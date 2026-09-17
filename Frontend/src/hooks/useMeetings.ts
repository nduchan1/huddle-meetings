import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../api/client'
import { getTeamMeetings } from '../api/meetings'
import type { Meeting } from '../types'

type Loaded = {
  key: string
  meetings: Meeting[]
  error: string | null
}

/** Meetings of one team. A change of team aborts the request in flight so stale data never lands. */
export function useMeetings(teamId: number | null) {
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<Loaded>({ key: '', meetings: [], error: null })
  const key = teamId === null ? '' : `${teamId}#${attempt}`

  useEffect(() => {
    if (teamId === null) return
    const controller = new AbortController()
    getTeamMeetings(teamId, controller.signal).then(
      (meetings) => setLoaded({ key, meetings, error: null }),
      (error: unknown) => {
        if (!controller.signal.aborted) setLoaded({ key, meetings: [], error: getErrorMessage(error) })
      },
    )
    return () => controller.abort()
  }, [teamId, key])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  const removeMeeting = useCallback((id: number) => {
    setLoaded((current) => ({ ...current, meetings: current.meetings.filter((meeting) => meeting.id !== id) }))
  }, [])

  const ready = teamId !== null && loaded.key === key
  return {
    meetings: ready ? loaded.meetings : null,
    loading: teamId !== null && !ready,
    error: ready ? loaded.error : null,
    reload,
    removeMeeting,
  }
}
