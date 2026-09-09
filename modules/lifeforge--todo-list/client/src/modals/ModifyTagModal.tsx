import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { InferInput } from '@lifeforge/api'
import { FormModal, defineForm, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { TodoListTag } from '../providers/TodoListProvider'

function ModifyTagModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TodoListTag
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.tags.create
      : forgeAPI.tags.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['todoList', 'tags']
        })
      },
      onError: error => {
        toast.error(`Failed to ${type} tag: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.tags)[typeof type]>['body']
  >({
    icon: 'tabler:tag',
    namespace: 'apps.todoList',
    title: `tag.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      name: 'text',
      color: 'color'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Tag name',
        icon: 'tabler:tag',
        placeholder: 'Tag name'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTagModal
