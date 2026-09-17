import type { MouseEventHandler, ReactNode, Ref } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

type BaseProps = {
  variant?: Variant
  icon?: ReactNode
  trailingIcon?: ReactNode
  className?: string
  children: ReactNode
  'aria-label'?: string
}

type LinkButtonProps = BaseProps & {
  to: string
  disabled?: boolean
}

type NativeButtonProps = BaseProps & {
  to?: undefined
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  ref?: Ref<HTMLButtonElement>
}

type Props = LinkButtonProps | NativeButtonProps

/** Renders a styled <button>, or a <Link> when `to` is given, with the same look. */
export function Button(props: Props) {
  const { variant = 'primary', icon, trailingIcon, className, children, 'aria-label': ariaLabel } = props
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {trailingIcon}
    </>
  )

  if (props.to !== undefined) {
    const disabled = props.disabled === true
    return (
      <Link
        to={props.to}
        className={disabled ? `${classes} is-disabled` : classes}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
      >
        {content}
      </Link>
    )
  }

  const { ref, type = 'button', disabled, onClick } = props
  return (
    <button ref={ref} type={type} className={classes} disabled={disabled} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </button>
  )
}
