import { useCallback, useEffect, useState } from 'react'

import { getAccessToken } from '@lifeforge/api'
import {
  Button,
  Card,
  Checkbox,
  Flex,
  LoadingScreen,
  ModuleHeader,
  Text,
  TextInput
} from '@lifeforge/ui'

const RECORDS_URL = `${import.meta.env.VITE_API_HOST || ''}/api/collections/todo_list__entries/records`

type TodoItem = {
  id: string
  summary: string
  done: boolean
}

type RecordsResponse = {
  items?: TodoItem[]
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    ...init,
    headers: {
      Authorization: `Bearer ${getAccessToken() ?? ''}`,
      'Content-Type': 'application/json',
      ...init?.headers
    }
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

function TodoList() {
  const [items, setItems] = useState<TodoItem[]>([])
  const [newSummary, setNewSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await request<RecordsResponse>(RECORDS_URL)
      setItems(result.items ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load tasks.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  async function createTask() {
    const summary = newSummary.trim()

    if (!summary) return

    setSaving(true)
    setError(null)

    try {
      const item = await request<TodoItem>(RECORDS_URL, {
        method: 'POST',
        body: JSON.stringify({
          summary,
          done: false
        })
      })
      setItems(current => [...current, item])
      setNewSummary('')
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Unable to create task.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function updateTask(id: string, updates: Partial<TodoItem>) {
    setError(null)

    try {
      const item = await request<TodoItem>(`${RECORDS_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      })
      setItems(current =>
        current.map(currentItem => (currentItem.id === id ? item : currentItem))
      )
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update task.'
      )
      await loadItems()
    }
  }

  async function deleteTask(id: string) {
    setError(null)

    try {
      await request<void>(`${RECORDS_URL}/${id}`, { method: 'DELETE' })
      setItems(current => current.filter(item => item.id !== id))
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete task.'
      )
    }
  }

  return (
    <Flex direction="column" flex="1" mb="2xl" minHeight="0" overflow="auto">
      <ModuleHeader
        icon="tabler:checklist"
        namespace="common.todo"
        title="todo"
      />
      <Flex direction="column" gap="lg" maxWidth="48rem" px="md" width="100%">
        <Flex align="end" gap="md">
          <TextInput
            label="New task"
            namespace={false}
            placeholder="What needs to be done?"
            value={newSummary}
            onChange={setNewSummary}
            onEnter={() => void createTask()}
          />
          <Button
            disabled={!newSummary.trim()}
            icon="tabler:plus"
            loading={saving}
            namespace={false}
            onClick={() => void createTask()}
          >
            Add
          </Button>
        </Flex>

        {error && (
          <Card>
            <Flex align="center" gap="md" justify="between">
              <Text color="orange-500">{error}</Text>
              <Button
                namespace={false}
                variant="secondary"
                onClick={() => void loadItems()}
              >
                Retry
              </Button>
            </Flex>
          </Card>
        )}

        {loading ? (
          <LoadingScreen message="Loading tasks..." />
        ) : items.length === 0 ? (
          <Card>
            <Text color="muted">No tasks yet.</Text>
          </Card>
        ) : (
          <Flex
            as="ul"
            direction="column"
            gap="sm"
            style={{ margin: 0, padding: 0 }}
          >
            {items.map(item => (
              <Card key={item.id} as="li">
                <Flex align="center" gap="md">
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={done => void updateTask(item.id, { done })}
                  />
                  <TextInput
                    aria-label={`Edit ${item.summary}`}
                    namespace={false}
                    placeholder="Task summary"
                    size="small"
                    style={{ flex: 1, minWidth: 0 }}
                    value={item.summary}
                    variant="plain"
                    onBlur={() => {
                      const summary = item.summary.trim()

                      if (summary) void updateTask(item.id, { summary })
                    }}
                    onChange={summary => {
                      setItems(current =>
                        current.map(currentItem =>
                          currentItem.id === item.id
                            ? { ...currentItem, summary }
                            : currentItem
                        )
                      )
                    }}
                    onEnter={() => {
                      const summary = item.summary.trim()

                      if (summary) void updateTask(item.id, { summary })
                    }}
                  />
                  <Button
                    dangerous
                    icon="tabler:trash"
                    namespace={false}
                    variant="plain"
                    onClick={() => void deleteTask(item.id)}
                  />
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default TodoList
