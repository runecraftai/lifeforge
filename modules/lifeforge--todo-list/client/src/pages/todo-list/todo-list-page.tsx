import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import {
  Box,
  EmptyStateScreen,
  FAB,
  Flex,
  SearchInput,
  WithQuery,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { filterTasksBySummary } from '@/entities/task'
import {
  type Task,
  useTodoListContext
} from '@/entities/task'

import { ModifyTaskDrawer } from '@/features/edit-task/modify-task-drawer'

import { Header } from './header'
import { Sidebar } from './sidebar'
import { TaskList } from './task-list'

function TodoListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { entriesQuery, setModifyTaskWindowOpenType, setSelectedTask } =
    useTodoListContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState<Task[]>([])
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
    setFilteredEntries(
      filterTasksBySummary(entriesQuery.data ?? [], searchQuery)
    )
  }, [searchQuery, entriesQuery.data])

  return (
    <>
      <Flex flex="1" height="100%" minHeight="0" width="100%">
        <Sidebar />
        <Flex
          direction="column"
          flex="1"
          height="100%"
          ml={{ base: 'none', xl: 'xl' }}
          position="relative"
          width="100%"
          zIndex="10"
        >
          <Header />
          <Box px="md" width="100%">
            <SearchInput
              debounceMs={300}
              mt="md"
              searchTarget="task"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Box>
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
        </Flex>
      </Flex>
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

export { TodoListPage }
