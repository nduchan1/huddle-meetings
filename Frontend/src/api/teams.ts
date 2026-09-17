import type { Team } from '../types'
import { request } from './client'

export function getTeams(signal?: AbortSignal): Promise<Team[]> {
  return request<Team[]>('/api/teams', { signal })
}
