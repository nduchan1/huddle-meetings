type SkeletonProps = {
  width?: string
  height?: number
  className?: string
}

export function Skeleton({ width = '100%', height = 14, className }: SkeletonProps) {
  return <span className={['skeleton', className].filter(Boolean).join(' ')} style={{ width, height }} />
}

/** Placeholder with the same silhouette as a MeetingCard, shown while a list loads. */
export function MeetingCardSkeleton() {
  return (
    <div className="card meeting-card meeting-card--skeleton" aria-hidden="true">
      <div className="meeting-card__top">
        <Skeleton width="96px" height={26} className="skeleton--pill" />
        <Skeleton width="72px" height={26} className="skeleton--pill" />
      </div>
      <Skeleton width="80%" height={20} />
      <div className="meeting-card__meta">
        <Skeleton width="45%" />
        <Skeleton width="70%" />
      </div>
      <div className="meeting-card__actions">
        <Skeleton width="72px" height={34} />
        <Skeleton width="80px" height={34} />
      </div>
    </div>
  )
}
