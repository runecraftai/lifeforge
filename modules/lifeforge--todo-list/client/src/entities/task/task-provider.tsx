import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { parseAsString, useQueryState } from 'nuqs'

import { forgeAPI } from '@/manifest'
import type { Task } from '@/entities/task'
import type { TaskList } from '@/entities/list'
import type { TaskTag } from '@/entities/tag'
import type { TaskPriority } from '@/entities/priority'


export type TodoListStatusCounter = {
  all: number
  today: number
  scheduled: number
  overdue: number
  completed: number
}

interface ITodoListData {
  // Data
  prioritiesQuery: UseQueryResult<TaskPriority[]>
  listsQuery: UseQueryResult<TaskList[]>
  tagsListQuery: UseQueryResult<TaskTag[]>
  entriesQuery: UseQueryResult<Task[]>
  statusCounterQuery: UseQueryResult<TodoListStatusCounter>

  // State
  filter: {
    status: string | null
    tag: string | null
    list: string | null
    priority: string | null
  }
  selectedTask: Task | null

  // Modals
  modifyTaskWindowOpenType: 'create' | 'update' | null

  // Setters
  setModifyTaskWindowOpenType: (value: 'create' | 'update' | null) => void
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
  setFilter: (
    key: 'status' | 'tag' | 'list' | 'priority',
    value: string | null
  ) => void
}

export const TodoListContext = createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<{
    status: string | null
    tag: string | null
    list: string | null
    priority: string | null
  }>({
    status: null,
    tag: null,
    list: null,
    priority: null
  })

  const statusCounterQuery = useQuery(
    forgeAPI.entries.getStatusCounter.queryOptions()
  )

  const prioritiesQuery = useQuery(forgeAPI.priorities.list.queryOptions())
  const listsQuery = useQuery(forgeAPI.lists.list.queryOptions())
  const tagsListQuery = useQuery(forgeAPI.tags.list.queryOptions())

  const entriesQuery = useQuery(
    forgeAPI.entries.list
      .input({
        status: filter.status ?? 'all',
        tag: filter.tag ?? undefined,
        list: filter.list ?? undefined,
        priority: filter.priority ?? undefined
      })
      .queryOptions()
  )

  const [taskWindow, setTaskWindow] = useQueryState('task', parseAsString)
  const modifyTaskWindowOpenType: 'create' | 'update' | null =
    taskWindow === 'create' || taskWindow === 'update'
      ? (taskWindow as 'create' | 'update')
      : null

  function setModifyTaskWindowOpenType(value: 'create' | 'update' | null) {
    void setTaskWindow(value)
  }

  const [deleteTaskConfirmationModalOpen, setDeleteTaskConfirmationModalOpen] =
    useState(false)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const value = useMemo(
    () => ({
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      filter,
      selectedTask,
      modifyTaskWindowOpenType,
      setModifyTaskWindowOpenType,
      setDeleteTaskConfirmationModalOpen,
      setSelectedTask,
      setFilter: (key: keyof typeof filter, value: string | null) => {
        setFilter(prev => ({
          ...prev,
          [key]: value
        }))
      }
    }),
    [
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      selectedTask,
      modifyTaskWindowOpenType,
      deleteTaskConfirmationModalOpen,
      filter
    ]
  )

  return <TodoListContext value={value}>{children}</TodoListContext>
}

export function useTodoListContext(): ITodoListData {
  const context = useContext(TodoListContext)

  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider')
  }

  return context
}

export type { TaskList } from '@/entities/list'
export type { TaskTag } from '@/entities/tag'
export type { TaskPriority } from '@/entities/priority'
export type { Task }
