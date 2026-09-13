import type { ReactNode } from 'react'

export type KanbanLaneVariant = 'default' | 'compact'

export type KanbanLaneProps = Omit<
  React.ComponentPropsWithoutRef<'section'>,
  'children' | 'className' | 'title'
> & {
  /** Lane heading. */
  title: ReactNode
  /** Normal or compact vertical spacing. */
  variant?: KanbanLaneVariant
  /** Additional classes for the section element. */
  className?: string
  /** Columns rendered in the lane. */
  children?: ReactNode
}

export function KanbanLane({
  title,
  variant = 'default',
  className,
  children,
  ...props
}: KanbanLaneProps) {
  const classes = [variant === 'compact' ? 'space-y-2' : 'space-y-3', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section {...props} className={classes}>
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-lf-bg-50">
          {title}
        </h2>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-lf-bg-700" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  )
}
