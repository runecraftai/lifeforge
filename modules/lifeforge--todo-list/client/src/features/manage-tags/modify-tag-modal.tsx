import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { type InferInput, useForgeMutation } from '@lifeforge/api'
import { FormModal, TextField, createDefaultValues } from '@lifeforge/ui'

import type { TaskTag } from '@/entities/tag'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Required')
})

export function ModifyTagModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TaskTag
  }
  onClose: () => void
}) {
  const createMutation = useForgeMutation(forgeAPI.tags.create, {
    action: 'create',
    queryKey: forgeAPI.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.tags.update.input({ id: initialData?.id || '' }),
    {
      action: 'update',
      queryKey: forgeAPI.key
    }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
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
          ).mutateAsync(data as InferInput<typeof forgeAPI.tags.create>['body'])
        }
      }}
      uiConfig={{
        icon: 'tabler:tag',
        namespace: 'apps.todoList',
        title: `tag.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:tag"
        label="tagName"
        name="name"
        placeholder="Tag name"
      />
    </FormModal>
  )
}
