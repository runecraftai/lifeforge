import type { ReactNode } from 'react'

export type KanbanColumnVariant = 'default' | 'drop-target'

export type KanbanColumnProps = Omit<
  React.ComponentPropsWithoutRef<'section'>,
  'children' | 'className' | 'title'
> & {
  /** Status heading. */
  title: ReactNode
  /** Number displayed in the count pill. */
  count: number
  /** Content shown when the column is empty. */
  emptyLabel?: ReactNode
  /** Whether to show the empty state. */
  isEmpty?: boolean
  /** Presentation used for a normal column or a drop target. */
  variant?: KanbanColumnVariant
  /** Additional classes for the section element. */
  className?: string
  /** Draggable cards or other column content. */
  children?: ReactNode
}

export function KanbanColumn({
  title,
  count,
  emptyLabel = 'No items',
  isEmpty = false,
  variant = 'default',
  className,
  children,
  ...props
}: KanbanColumnProps) {
  const classes = [
    'flex min-h-80 min-w-72 flex-1 flex-col rounded-xl bg-zinc-100/80 p-3',
    'dark:bg-lf-bg-800/80',
    variant === 'drop-target' && 'ring-2 ring-primary ring-offset-2',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section {...props} className={classes}>
      <header className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-lf-bg-300">
          {title}
        </h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-zinc-500 shadow-sm dark:bg-lf-bg-900 dark:text-lf-bg-400">
          {count}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {children}
        {isEmpty && (
          <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400 dark:border-lf-bg-600 dark:text-lf-bg-400">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  )
}
