import { useCallback, useEffect, useState } from 'react'
import { ApiError, getErrorMessage } from '../api/client'
import { getMeeting } from '../api/meetings'
import type { Meeting } from '../types'

type Loaded = {
  key: string
  meeting: Meeting | null
  error: string | null
  notFound: boolean
}

/** One meeting by id (null id = nothing to load, e.g. a malformed URL). */
export function useMeeting(id: number | null) {
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<Loaded>({ key: '', meeting: null, error: null, notFound: false })
  const key = id === null ? '' : `${id}#${attempt}`

  useEffect(() => {
    if (id === null) return
    const controller = new AbortController()
    getMeeting(id, controller.signal).then(
      (meeting) => setLoaded({ key, meeting, error: null, notFound: false }),
      (error: unknown) => {
        if (controller.signal.aborted) return
        const notFound = error instanceof ApiError && error.status === 404
        setLoaded({ key, meeting: null, error: notFound ? null : getErrorMessage(error), notFound })
      },
    )
    return () => controller.abort()
  }, [id, key])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  const ready = id !== null && loaded.key === key
  return {
    meeting: ready ? loaded.meeting : null,
    loading: id !== null && !ready,
    error: ready ? loaded.error : null,
    notFound: id === null || (ready && loaded.notFound),
    reload,
  }
}
