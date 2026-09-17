import type { Meeting, MeetingInput } from '../types'
import { request } from './client'

export function getTeamMeetings(teamId: number, signal?: AbortSignal): Promise<Meeting[]> {
  return request<Meeting[]>(`/api/teams/${teamId}/meetings`, { signal })
}

export function getMeeting(id: number, signal?: AbortSignal): Promise<Meeting> {
  return request<Meeting>(`/api/meetings/${id}`, { signal })
}

export function createMeeting(input: MeetingInput): Promise<Meeting> {
  return request<Meeting>('/api/meetings', { method: 'POST', body: input })
}

export function updateMeeting(id: number, input: MeetingInput): Promise<Meeting> {
  return request<Meeting>(`/api/meetings/${id}`, { method: 'PUT', body: input })
}

export function deleteMeeting(id: number): Promise<void> {
  return request<void>(`/api/meetings/${id}`, { method: 'DELETE' })
}
