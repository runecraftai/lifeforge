import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Card,
  Flex,
  ModuleHeader,
  Text,
  TextAreaInput,
  TextInput
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type Note = {
  id: string
  title: string
  content: string
  created: string
  updated: string
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selected, setSelected] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  async function refresh(search = query) {
    try {
      setNotes(
        await forgeAPI.notes.list.input({ query: search || undefined }).query()
      )
      setError('')
    } catch {
      setError('Unable to load notes')
    }
  }

  useEffect(() => {
    void refresh('')
  }, [])

  function edit(note: Note | null) {
    setSelected(note)
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim()) return

    try {
      if (selected) {
        await forgeAPI.notes.update.input({ id: selected.id }).mutate({
          title: title.trim(),
          content
        })
      } else {
        await forgeAPI.notes.create.mutate({
          title: title.trim(),
          content
        })
      }
      edit(null)
      await refresh()
    } catch {
      setError('Unable to save note')
    }
  }

  async function remove(id: string) {
    try {
      await forgeAPI.notes.remove.input({ id }).mutate(undefined)
      if (selected?.id === id) edit(null)
      await refresh()
    } catch {
      setError('Unable to delete note')
    }
  }

  return (
    <Flex direction="column" flex="1" mb="2xl" minHeight="0">
      <ModuleHeader />
      <Flex
        direction={{ base: 'column', md: 'row' }}
        flex="1"
        gap="lg"
        minHeight="0"
        overflow="auto"
        px="md"
      >
        <Box flex="1" minWidth="0">
          <Flex align="end" gap="sm" mb="md">
            <TextInput
              label="Search notes"
              namespace={false}
              placeholder="Search notes"
              value={query}
              onChange={setQuery}
              onEnter={() => void refresh()}
            />
            <Button
              icon="tabler:search"
              namespace={false}
              onClick={() => void refresh()}
            >
              Search
            </Button>
          </Flex>
          <Button
            icon="tabler:plus"
            namespace={false}
            variant="secondary"
            onClick={() => edit(null)}
          >
            New note
          </Button>
          <Flex direction="column" gap="sm" mt="md">
            {notes.map(note => (
              <Card key={note.id} isInteractive onClick={() => edit(note)}>
                <Text as="h2" size="lg" weight="semibold">
                  {note.title}
                </Text>
                <Text color="muted" lineClamp={3} mt="sm">
                  {note.content || 'No content'}
                </Text>
              </Card>
            ))}
            {!notes.length && <Text color="muted">No notes found.</Text>}
          </Flex>
        </Box>
        <Card flex="2" minWidth="0">
          <Flex as="form" direction="column" gap="md" onSubmit={save}>
            <TextInput
              required
              label="Title"
              namespace={false}
              placeholder="Title"
              value={title}
              onChange={setTitle}
            />
            <TextAreaInput
              label="Content"
              namespace={false}
              placeholder="Write your note..."
              value={content}
              onChange={setContent}
            />
            <Flex gap="sm">
              <Button
                icon="tabler:device-floppy"
                namespace={false}
                type="submit"
              >
                {selected ? 'Save' : 'Create'}
              </Button>
              {selected && (
                <>
                  <Button
                    dangerous
                    icon="tabler:trash"
                    namespace={false}
                    type="button"
                    variant="secondary"
                    onClick={() => void remove(selected.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    namespace={false}
                    type="button"
                    variant="plain"
                    onClick={() => edit(null)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
          {error && (
            <Text color="dangerous" mt="md" role="alert">
              {error}
            </Text>
          )}
        </Card>
      </Flex>
    </Flex>
  )
}
