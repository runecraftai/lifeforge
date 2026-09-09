import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import {
  EmptyStateScreen,
  FAB,
  SearchInput,
  WithQuery,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import {
  type TodoListEntry,
  useTodoListContext
} from '@/providers/TodoListProvider'

import Header from './Header'
import ModifyTaskDrawer from './ModifyTaskDrawer'
import Sidebar from './Sidebar'
import TaskList from './tasks/TaskList'

function TodoListContainer() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { entriesQuery, setModifyTaskWindowOpenType, setSelectedTask } =
    useTodoListContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState<TodoListEntry[]>([])
  const { hash } = useLocation()

  async function fetchAndSetTask(id: string) {
    try {
      const data = await forgeAPI.entries.getById
        .input({
          id
        })
        .query()

      setSelectedTask(data)
      setModifyTaskWindowOpenType('update')
    } catch (error) {
      console.error('Error fetching entry:', error)
      toast.error('Error fetching entry')
    }
  }

  useEffect(() => {
    if (hash === '#new') {
      setSelectedTask(null)
      setModifyTaskWindowOpenType('create')
    }
  }, [hash])

  useEffect(() => {
    const id = searchParams.get('entry')

    if (id) {
      fetchAndSetTask(id)

      const newSearchParams = new URLSearchParams(searchParams)

      newSearchParams.delete('entry')
      setSearchParams(newSearchParams, { replace: true })
    }
  }, [searchParams, entriesQuery.data])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entriesQuery.data ?? [])

      return
    }

    const lowerCaseQuery = searchQuery.toLowerCase()

    const filtered = (entriesQuery.data ?? []).filter(entry =>
      entry.summary.toLowerCase().includes(lowerCaseQuery)
    )

    setFilteredEntries(filtered)
  }, [searchQuery, entriesQuery.data])

  return (
    <>
      <div className="flex size-full min-h-0 flex-1">
        <Sidebar />
        <div className="relative z-10 flex h-full flex-1 flex-col xl:ml-8">
          <Header />
          <div className="w-full px-4">
            <SearchInput
              className="mt-4"
              debounceMs={300}
              searchTarget="task"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <WithQuery query={entriesQuery}>
            {() =>
              filteredEntries.length > 0 ? (
                <TaskList entries={filteredEntries} />
              ) : (
                <EmptyStateScreen
                  icon="tabler:article-off"
                  message={{
                    id: 'tasks'
                  }}
                />
              )
            }
          </WithQuery>
        </div>
      </div>
      <ModifyTaskDrawer />
      {(entriesQuery.data ?? []).length > 0 && (
        <FAB
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        />
      )}
    </>
  )
}

export default TodoListContainer
