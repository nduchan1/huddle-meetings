import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ApiError, getErrorMessage } from '../api/client'
import { formatDuration, fromInputValue, toInputValue } from '../lib/datetime'
import {
  DESCRIPTION_MAX_LENGTH,
  FIELD_ORDER,
  ROOMS,
  ROOM_MAX_LENGTH,
  firstInvalidField,
  validateMeetingForm,
} from '../lib/validation'
import type {
  MeetingFormErrors,
  MeetingFormField,
  MeetingFormMode,
  MeetingFormValues,
  MeetingInput,
  Team,
} from '../types'
import { Button } from './Button'
import { ErrorBanner } from './ErrorBanner'
import { AlertIcon, ClockIcon } from './Icons'
import { TeamSelect } from './TeamSelect'

type Props = {
  mode: MeetingFormMode
  teams: Team[]
  teamsLoading?: boolean
  initialValues: MeetingFormValues
  submitLabel: string
  onSubmit: (input: MeetingInput) => Promise<void>
}

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={['field', className].filter(Boolean).join(' ')}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field__error">
          <AlertIcon size={14} />
          {error}
        </p>
      ) : (
        hint && <p className="field__hint">{hint}</p>
      )}
    </div>
  )
}

/** Keeps only the field errors the form can display, in case the API reports something unexpected. */
function pickFieldErrors(fields: Record<string, string>): MeetingFormErrors {
  const errors: MeetingFormErrors = {}
  for (const field of FIELD_ORDER) {
    const message = fields[field]
    if (message) errors[field] = message
  }
  return errors
}

export function MeetingForm({ mode, teams, teamsLoading = false, initialValues, submitLabel, onSubmit }: Props) {
  const baseId = useId()
  const [values, setValues] = useState<MeetingFormValues>(initialValues)
  const [errors, setErrors] = useState<MeetingFormErrors>({})
  const [validateLive, setValidateLive] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fieldElements = useRef<Partial<Record<MeetingFormField, FieldElement | null>>>({})

  const fieldId = (field: MeetingFormField) => `${baseId}-${field}`
  const describedBy = (field: MeetingFormField) => (errors[field] ? `${fieldId(field)}-error` : undefined)
  const registerField = (field: MeetingFormField) => (element: FieldElement | null) => {
    fieldElements.current[field] = element
  }

  const update = (field: MeetingFormField, value: string) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (validateLive) setErrors(validateMeetingForm(next, mode))
  }

  const focusField = (field: MeetingFormField | undefined) => {
    if (field) fieldElements.current[field]?.focus()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = validateMeetingForm(values, mode)
    setErrors(validation)
    setValidateLive(true)
    setServerError(null)
    const invalid = firstInvalidField(validation)
    if (invalid) {
      focusField(invalid)
      return
    }
    const start = fromInputValue(values.startTime)
    const end = fromInputValue(values.endTime)
    if (start === null || end === null) return

    setSubmitting(true)
    try {
      await onSubmit({
        teamId: Number(values.teamId),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        room: values.room.trim(),
        description: values.description.trim(),
      })
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        const fieldErrors = pickFieldErrors(error.fields)
        const first = firstInvalidField(fieldErrors)
        setErrors(fieldErrors)
        if (first) focusField(first)
        else setServerError(error.message)
      } else {
        setServerError(getErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const start = fromInputValue(values.startTime)
  const end = fromInputValue(values.endTime)
  const duration = start !== null && end !== null && end > start ? formatDuration(start, end) : '—'
  const cancelTo = values.teamId ? `/meetings?team=${values.teamId}` : '/meetings'
  const roomsListId = `${baseId}-rooms`

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <Field id={fieldId('teamId')} label="Team" error={errors.teamId} className="field--full">
          <TeamSelect
            ref={registerField('teamId')}
            id={fieldId('teamId')}
            value={values.teamId}
            teams={teams}
            loading={teamsLoading}
            onChange={(value) => update('teamId', value)}
            required
            invalid={Boolean(errors.teamId)}
            describedBy={describedBy('teamId')}
          />
        </Field>

        <Field id={fieldId('startTime')} label="Start" error={errors.startTime}>
          <input
            ref={registerField('startTime')}
            id={fieldId('startTime')}
            className="input"
            type="datetime-local"
            value={values.startTime}
            min={mode === 'create' ? toInputValue(new Date()) : undefined}
            onChange={(event) => update('startTime', event.target.value)}
            required
            aria-required="true"
            aria-invalid={errors.startTime ? true : undefined}
            aria-describedby={describedBy('startTime')}
          />
        </Field>

        <Field id={fieldId('endTime')} label="End" error={errors.endTime}>
          <input
            ref={registerField('endTime')}
            id={fieldId('endTime')}
            className="input"
            type="datetime-local"
            value={values.endTime}
            onChange={(event) => update('endTime', event.target.value)}
            required
            aria-required="true"
            aria-invalid={errors.endTime ? true : undefined}
            aria-describedby={describedBy('endTime')}
          />
        </Field>

        <p className="form__duration field--full" aria-live="polite">
          <ClockIcon />
          <span>
            Duration: <strong>{duration}</strong>
          </span>
        </p>

        <Field id={fieldId('room')} label="Room" error={errors.room} className="field--full">
          <input
            ref={registerField('room')}
            id={fieldId('room')}
            className="input"
            type="text"
            list={roomsListId}
            placeholder="e.g. Blue Room"
            maxLength={ROOM_MAX_LENGTH}
            autoComplete="off"
            value={values.room}
            onChange={(event) => update('room', event.target.value)}
            required
            aria-required="true"
            aria-invalid={errors.room ? true : undefined}
            aria-describedby={describedBy('room')}
          />
          <datalist id={roomsListId}>
            {ROOMS.map((room) => (
              <option key={room} value={room} />
            ))}
          </datalist>
        </Field>

        <Field
          id={fieldId('description')}
          label="Description"
          error={errors.description}
          className="field--full"
          hint={`${values.description.trim().length}/${DESCRIPTION_MAX_LENGTH} characters`}
        >
          <textarea
            ref={registerField('description')}
            id={fieldId('description')}
            className="textarea"
            rows={3}
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="What is the meeting about?"
            value={values.description}
            onChange={(event) => update('description', event.target.value)}
            required
            aria-required="true"
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={describedBy('description')}
          />
        </Field>
      </div>

      {serverError && <ErrorBanner message={serverError} />}

      <div className="form__actions">
        <Button to={cancelTo} variant="ghost" disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
