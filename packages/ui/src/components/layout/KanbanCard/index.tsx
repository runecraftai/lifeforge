import type { ReactNode } from 'react'

export type KanbanCardVariant = 'default' | 'dragging'

export type KanbanCardProps = Omit<
  React.ComponentPropsWithoutRef<'article'>,
  'children' | 'className' | 'draggable' | 'onDragStart' | 'title'
> & {
  /** Card heading. */
  title: ReactNode
  /** Optional identifier rendered below the badges. */
  itemId?: ReactNode
  /** Optional neutral source badge. */
  source?: ReactNode
  /** Optional amber priority badge. */
  priority?: ReactNode
  /** Optional blue repository badge. */
  repo?: ReactNode
  /** Optional outlined type badge. */
  kind?: ReactNode
  /** Presentation used for a normal card or a drag preview. */
  variant?: KanbanCardVariant
  /** Whether the card can be dragged. Defaults to true. */
  draggable?: boolean
  /** Additional classes for the article element. */
  className?: string
  /** Called when dragging starts. */
  onDragStart?: React.DragEventHandler<HTMLElement>
}

export function KanbanCard({
  title,
  itemId,
  source,
  priority,
  repo,
  kind,
  variant = 'default',
  draggable = true,
  className,
  onDragStart,
  ...props
}: KanbanCardProps) {
  const classes = [
    'group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition',
    'hover:-translate-y-0.5 hover:shadow-md',
    'dark:border-lf-bg-700 dark:bg-lf-bg-900',
    variant === 'dragging' && 'opacity-60 shadow-none',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      {...props}
      className={classes}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5 text-zinc-900 dark:text-lf-bg-50">
          {title}
        </h3>
        <span aria-hidden="true" className="text-zinc-400 dark:text-lf-bg-400">
          ⠿
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {source !== undefined && (
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-lf-bg-800 dark:text-lf-bg-300">
            {source}
          </span>
        )}
        {priority !== undefined && (
          <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {priority}
          </span>
        )}
        {repo !== undefined && (
          <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {repo}
          </span>
        )}
        {kind !== undefined && (
          <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500 dark:border-lf-bg-700 dark:text-lf-bg-400">
            {kind}
          </span>
        )}
      </div>
      {itemId !== undefined && (
        <p className="mt-3 text-[11px] text-zinc-400 dark:text-lf-bg-400">
          {itemId}
        </p>
      )}
    </article>
  )
}
