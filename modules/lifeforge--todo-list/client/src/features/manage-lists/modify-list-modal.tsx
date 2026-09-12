import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { type InferInput, useForgeMutation } from '@lifeforge/api'
import {
  ColorField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import type { TaskList } from '@/entities/list'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
})

export function ModifyListModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TaskList
  }
  onClose: () => void
}) {
  const createMutation = useForgeMutation(forgeAPI.lists.create, {
    action: 'create',
    queryKey: forgeAPI.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.lists.update.input({ id: initialData?.id || '' }),
    {
      action: 'update',
      queryKey: forgeAPI.key
    }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...(initialData ?? { color: '#FFFFFF' })
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          await (
            type === 'create' ? createMutation : updateMutation
          ).mutateAsync(
            data as InferInput<typeof forgeAPI.lists.create>['body']
          )
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.todoList',
        title: `list.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:list"
        label="listName"
        name="name"
        placeholder="List name"
      />
      <IconField required control={form.control} label="listIcon" name="icon" />
      <ColorField
        required
        control={form.control}
        label="listColor"
        name="color"
      />
    </FormModal>
  )
}
