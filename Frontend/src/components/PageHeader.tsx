import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  )
}
