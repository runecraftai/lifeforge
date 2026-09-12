import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'

import { usePromiseLoading } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  DateInput,
  Flex,
  Icon,
  Scrollbar,
  Switch,
  Text,
  TextAreaInput,
  TextInput,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { useTodoListContext } from '@/entities/task'

import { ListSelector } from './components/list-selector'
import { PrioritySelector } from './components/priority-selector'
import { TagsSelector } from './components/tags-selector'

function ModifyTaskDrawer() {
  const { open } = useModalStore()
  const queryClient = useQueryClient()
  const { t } = useModuleTranslation()

  const {
    modifyTaskWindowOpenType: openType,
    setModifyTaskWindowOpenType: setOpenType,
    selectedTask,
    setSelectedTask
  } = useTodoListContext()

  const [summary, setSummary] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDateHasTime, setDueDateHasTime] = useState(false)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [priority, setPriority] = useState<string>('')
  const [list, setList] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

  const [innerOpenType, setInnerOpenType] = useState<
    'create' | 'update' | null
  >(openType)

  const summaryInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    if (openType === null) return

    if (summary.trim().length === 0) {
      toast.error('Task summary cannot be empty.')

      return
    }

    const task = {
      summary: summary.trim(),
      notes: notes.trim(),
      due_date: dueDate ? dayjs(dueDate).toISOString() : '',
      due_date_has_time: dueDateHasTime,
      priority: priority ?? null,
      list: list ?? '',
      tags
    }

    try {
      await (
        openType === 'create'
          ? forgeAPI.entries.create
          : forgeAPI.entries.update.input({
              id: selectedTask!.id
            })
      ).mutate(task)

      setInnerOpenType(null)
      setOpenType(null)
      setSelectedTask(null)

      await queryClient.invalidateQueries({
        queryKey: forgeAPI.key
      })
    } catch {
      toast.error('Error')
    }
  }

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  function closeWindow() {
    setInnerOpenType(null)
    setTimeout(() => {
      setOpenType(null)
      setSelectedTask(null)
    }, 300)
  }

  const deleteMutation = useMutation(
    forgeAPI.entries.remove
      .input({
        id: selectedTask?.id ?? ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.key
          })
          setOpenType(null)
          setSelectedTask(null)
        },
        onError: () => {
          toast.error('Error deleting task')
        }
      })
  )

  const handleDeleteTask = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Task',
      description: 'Are you sure you want to delete this task?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [selectedTask])

  useEffect(() => {
    setTimeout(() => {
      setInnerOpenType(openType)

      if (summaryInputRef.current) {
        summaryInputRef.current.focus()
      }
    }, 5)
  }, [openType])

  useEffect(() => {
    if (selectedTask !== null) {
      setSummary(selectedTask.summary)
      setNotes(selectedTask.notes)
      setDueDate(
        selectedTask.due_date ? dayjs(selectedTask.due_date).toDate() : null
      )
      setDueDateHasTime(selectedTask.due_date_has_time)
      setPriority(selectedTask.priority)
      setList(selectedTask.list)
      setTags(selectedTask.tags)
    } else {
      setSummary('')
      setNotes('')
      setDueDate(null)
      setDueDateHasTime(false)
      setPriority('')
      setList('')
      setTags([])
    }
  }, [selectedTask, openType])

  return (
    <Box
      bg="bg-900"
      height="100dvh"
      width="100%"
      style={{
        backgroundColor:
          'color-mix(in srgb, var(--color-bg-900) 20%, transparent)',
        inset: 0,
        opacity: innerOpenType !== null ? 1 : 0,
        pointerEvents: innerOpenType !== null ? 'auto' : 'none',
        position: 'fixed',
        transition: 'opacity 100ms ease-in-out',
        zIndex: innerOpenType !== null ? 9995 : -1
      }}
    >
      <Box
        as="button"
        height="100%"
        width="100%"
        style={{
          inset: 0,
          position: 'absolute'
        }}
        onClick={closeWindow}
      />
      <Flex
        bg={{ base: 'bg-100', dark: 'bg-900' }}
        direction="column"
        height="100%"
        p="2xl"
        position="absolute"
        right="0"
        top="0"
        width="min(40rem, 100%)"
        style={{
          borderRadius: 'var(--radius-xl) 0 0 var(--radius-xl)',
          transform:
            innerOpenType !== null ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease-in-out'
        }}
      >
        <Scrollbar style={{ flex: '1 1 auto', minHeight: 0 }}>
          <Flex align="center" justify="between" mb="2xl">
            <Flex align="center" gap="md">
              <Icon
                icon={
                  {
                    create: 'tabler:plus',
                    update: 'tabler:pencil'
                  }[innerOpenType ?? 'create']
                }
                size="1.75rem"
              />
              <Text as="h1" size="2xl" weight="semibold">
                {t(`modals.tasks.${innerOpenType ?? 'create'}`)}
              </Text>
            </Flex>
            <ContextMenu>
              <ContextMenuItem
                dangerous
                icon="tabler:trash"
                label="Delete"
                onClick={handleDeleteTask}
              />
            </ContextMenu>
          </Flex>
          <Flex direction="column" gap="sm">
            <TextInput
              required
              icon="tabler:abc"
              label="Summary"
              placeholder="An urgent task"
              value={summary}
              onChange={setSummary}
            />
            <Flex align="center" gap="md" justify="between" py="sm">
              <Flex align="center" gap="sm">
                <Icon icon="tabler:clock" size="1.5rem" />
                <Text size="lg">{t('inputs.hasTime')}</Text>
              </Flex>
              <Switch
                value={dueDateHasTime}
                onChange={() => {
                  setDueDateHasTime(!dueDateHasTime)
                  if (dueDate)
                    setDueDate(
                      dayjs(dueDate).set('hour', 0).set('minute', 0).toDate()
                    )
                }}
              />
            </Flex>
            <DateInput
              hasTime={dueDateHasTime}
              icon="tabler:calendar"
              label="Due date"
              value={dueDate}
              onChange={setDueDate}
            />
            <PrioritySelector priority={priority} setPriority={setPriority} />
            <ListSelector list={list} setList={setList} />
            <TagsSelector setTags={setTags} tags={tags} />
            <TextAreaInput
              icon="tabler:pencil"
              label="Notes"
              placeholder="Add notes here..."
              value={notes}
              onChange={setNotes}
            />
          </Flex>
          <Flex justify="end" gap="sm" mt="3xl">
            <Button loading={loading} variant="secondary" onClick={closeWindow}>
              cancel
            </Button>
            <Button
              icon={
                innerOpenType === 'update' ? 'tabler:pencil' : 'tabler:plus'
              }
              loading={loading}
              onClick={onSubmit}
            >
              {innerOpenType === 'update' ? 'Update' : 'Create'}
            </Button>
          </Flex>
        </Scrollbar>
      </Flex>
    </Box>
  )
}

export { ModifyTaskDrawer }
