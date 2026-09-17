import { Button } from '../components/Button'
import { ArrowRightIcon } from '../components/Icons'
import { usePageTitle } from '../hooks/usePageTitle'

type Props = {
  title?: string
  description?: string
}

export function NotFoundPage({
  title = 'Page not found',
  description = 'The page you are looking for does not exist or has moved.',
}: Props) {
  usePageTitle(title)

  return (
    <div className="card not-found">
      <p className="eyebrow">Error 404</p>
      <h1 className="not-found__title">{title}</h1>
      <p className="not-found__text">{description}</p>
      <div className="not-found__actions">
        <Button to="/" trailingIcon={<ArrowRightIcon />}>
          Back to home
        </Button>
        <Button to="/meetings" variant="secondary">
          Browse meetings
        </Button>
      </div>
    </div>
  )
}
