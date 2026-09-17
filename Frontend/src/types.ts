export type Team = {
  id: number
  name: string
}

export type Meeting = {
  id: number
  teamId: number
  teamName: string
  startTime: string
  endTime: string
  description: string
  room: string
}

export type MeetingInput = {
  teamId: number
  startTime: string
  endTime: string
  description: string
  room: string
}

export type MeetingStatus = 'upcoming' | 'past'

/** Raw values of the meeting form: everything is a string exactly as the inputs hold it. */
export type MeetingFormValues = {
  teamId: string
  startTime: string
  endTime: string
  room: string
  description: string
}

export type MeetingFormField = keyof MeetingFormValues

export type MeetingFormErrors = Partial<Record<MeetingFormField, string>>

export type MeetingFormMode = 'create' | 'edit'
