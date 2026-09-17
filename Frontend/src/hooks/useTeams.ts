import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../api/client'
import { getTeams } from '../api/teams'
import type { Team } from '../types'

type Loaded = {
  attempt: number
  teams: Team[]
  error: string | null
}

export function useTeams() {
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<Loaded>({ attempt: -1, teams: [], error: null })

  useEffect(() => {
    const controller = new AbortController()
    getTeams(controller.signal).then(
      (teams) => setLoaded({ attempt, teams, error: null }),
      (error: unknown) => {
        if (!controller.signal.aborted) setLoaded({ attempt, teams: [], error: getErrorMessage(error) })
      },
    )
    return () => controller.abort()
  }, [attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])
  const loading = loaded.attempt !== attempt

  return { teams: loaded.teams, loading, error: loading ? null : loaded.error, reload }
}
