import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

import { Card, Checkbox, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import {
  type Task,
  useTodoListContext
} from '@/entities/task'

import { TaskDueDate } from './components/task-due-date'
import { TaskHeader } from './components/task-header'
import { TaskTags } from './components/task-tags'

function TaskItem({
  entry,
  className,
  isInDashboardWidget
}: {
  entry: Task
  className?: string
  isInDashboardWidget?: boolean
}) {
  const queryClient = useQueryClient()

  const {
    statusCounterQuery,
    listsQuery,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()

  const lists = listsQuery.data ?? []

  async function toggleTaskCompletion() {
    try {
      await forgeAPI.entries.toggleEntry
        .input({
          id: entry.id
        })
        .mutate(undefined)

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['todoList'] })
        statusCounterQuery.refetch()
      }, 500)
    } catch {
      toast.error('Error toggling task completion')
    }
  }

  return (
    <Card
      key={entry.id}
      isInteractive
      as="li"
      className={clsx('flex-between relative isolate flex gap-6', className)}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        {typeof lists !== 'string' && entry.list !== '' && (
          <span
            className="h-10 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor: lists.find(l => l.id === entry.list)?.color
            }}
          />
        )}
        <div className="w-full min-w-0">
          <TaskHeader entry={entry} />
          {(entry.due_date || entry.tags.length > 0) && (
            <div className="mt-1 flex items-center gap-2">
              <TaskDueDate entry={entry} />
              <TaskTags entry={entry} />
            </div>
          )}
        </div>
      </div>
      <Checkbox
        checked={entry.done}
        onCheckedChange={() => {
          toggleTaskCompletion()
        }}
      />
      <button
        aria-label={`Edit ${entry.summary}`}
        className="absolute top-0 left-0 size-full"
        style={{ inset: 0, position: 'absolute' }}
        onClick={() => {
          if (!isInDashboardWidget) {
            setModifyTaskWindowOpenType('update')
            setSelectedTask(entry)
          }
        }}
      />
    </Card>
  )
}

export { TaskItem }
