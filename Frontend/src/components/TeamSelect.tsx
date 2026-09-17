import type { Ref } from 'react'
import type { Team } from '../types'

type Props = {
  id: string
  value: string
  teams: Team[]
  onChange: (value: string) => void
  loading?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  describedBy?: string
  ref?: Ref<HTMLSelectElement>
}

export function TeamSelect({
  id,
  value,
  teams,
  onChange,
  loading = false,
  disabled = false,
  required = false,
  invalid = false,
  describedBy,
  ref,
}: Props) {
  return (
    <select
      ref={ref}
      id={id}
      className="select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      required={required}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    >
      <option value="">{loading ? 'Loading teams…' : 'Choose a team…'}</option>
      {teams.map((team) => (
        <option key={team.id} value={String(team.id)}>
          {team.name}
        </option>
      ))}
    </select>
  )
}
