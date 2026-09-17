import { Button } from './Button'
import { AlertIcon } from './Icons'

type Props = {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="error-banner" role="alert">
      <AlertIcon size={20} className="error-banner__icon" />
      <p className="error-banner__message">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="btn--sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
