import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { ReactNode } from 'react'

import { Text } from '@lifeforge/ui'

import type { Task } from '@/entities/task'

import * as styles from '../task-item.css'

dayjs.extend(relativeTime)

export function TaskDueDate({ entry }: { entry: Task }) {
  const isCompleted = entry.done && entry.completed_at !== ''
  const hasDueDate = entry.due_date !== ''
  const isOverdue = hasDueDate && dayjs(entry.due_date).isBefore(dayjs())
  const dueDateColor = isOverdue ? 'dangerous' : 'muted'

  let content: ReactNode = null

  if (isCompleted) {
    content = (
      <Text color="muted" size="sm" whiteSpace="nowrap">
        Completed: {dayjs(entry.completed_at).fromNow()}
      </Text>
    )
  } else if (hasDueDate) {
    content = (
      <Text
        className={styles.dueDate}
        color={dueDateColor}
        size="sm"
        whiteSpace="nowrap"
      >
        Due {dayjs(entry.due_date).fromNow()}
      </Text>
    )
  }

  return content
}
