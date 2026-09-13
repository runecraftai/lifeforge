import type { Session } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import type { InferInput } from '@lifeforge/api'
import {
  FormModal,
  SliderField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import DEFAULT_OPTIONS from '@/constants/default_durations'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1),
  work_duration: z.number(),
  short_break_duration: z.number(),
  long_break_duration: z.number(),
  session_until_long_break: z.number()
})

function ModifySessionModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: Session
  }
}) {
  const qc = useQueryClient()
  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.sessions.create
      : forgeAPI.sessions.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: forgeAPI.sessions.list.key }),
      onError: error => {
        console.error('Error submitting form:', error)
        toast.error('An error occurred while submitting the form.')
      }
    })
  )
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData,
      name: initialData?.name || `Productive Session on ${dayjs().format('MMM D')}`,
      work_duration: initialData?.work_duration || DEFAULT_OPTIONS.work,
      short_break_duration: initialData?.short_break_duration || DEFAULT_OPTIONS.short_break,
      long_break_duration: initialData?.long_break_duration || DEFAULT_OPTIONS.long_break,
      session_until_long_break: initialData?.session_until_long_break || DEFAULT_OPTIONS.session_until_long_break
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: openType,
        handler: async values => {
          await mutation.mutateAsync(values as InferInput<typeof forgeAPI.sessions.create>['body'])
        }
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `session.${openType}`,
        onClose,
        namespace: 'apps.pomodoro-timer'
      }}
    >
      <TextField autoFocus control={form.control} name="name" label="Session Name" icon="tabler:tag" placeholder="My Productive Session" required />
      <SliderField control={form.control} name="work_duration" label="Work Duration" icon="tabler:flame" min={1} max={120} hidden={openType === 'update'} />
      <SliderField control={form.control} name="short_break_duration" label="Short Break Duration" icon="tabler:coffee" min={1} max={60} hidden={openType === 'update'} />
      <SliderField control={form.control} name="long_break_duration" label="Long Break Duration" icon="tabler:beach" min={1} max={120} hidden={openType === 'update'} />
      <SliderField control={form.control} name="session_until_long_break" label="Sessions Until Long Break" icon="tabler:rotate-clockwise-2" min={1} max={10} hidden={openType === 'update'} />
    </FormModal>
  )
}

export default ModifySessionModal
