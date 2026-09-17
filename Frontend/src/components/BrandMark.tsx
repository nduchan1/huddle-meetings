type Props = { size?: number }

/** The Huddle mark: a calendar with two people in it, on an indigo tile. */
export function BrandMark({ size = 32 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#4f46e5" />
      <rect x="7" y="8" width="18" height="16" rx="3" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M7 13h18" stroke="#fff" strokeWidth="2" />
      <path d="M12 6v4M20 6v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12.5" cy="17.5" r="1.75" fill="#fff" />
      <circle cx="19.5" cy="17.5" r="1.75" fill="#fff" />
      <path
        d="M9.5 22c.6-1.4 1.7-2.1 3-2.1s2.4.7 3 2.1M15.5 22c.6-1.4 1.7-2.1 3-2.1s2.4.7 3 2.1"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
