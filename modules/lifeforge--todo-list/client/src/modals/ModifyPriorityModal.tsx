import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { InferInput } from '@lifeforge/api'
import { FormModal, defineForm, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { TodoListPriority } from '../providers/TodoListProvider'

function ModifyPriorityModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TodoListPriority
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.priorities.create
      : forgeAPI.priorities.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['todoList', 'priorities']
        })
      },
      onError: error => {
        toast.error(`Failed to ${type} priority: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.priorities)[typeof type]>['body']
  >({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    namespace: 'apps.todoList',
    title: `priority.${type}`,
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
        label: 'Priority name',
        icon: 'tabler:sort-ascending-numbers',
        placeholder: 'Priority name',
        type: 'text'
      },
      color: {
        required: true,
        label: 'Priority color',
        type: 'color'
      }
    })
    .initialData(
      initialData ?? {
        name: '',
        color: '#FFFFFF'
      }
    )
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyPriorityModal
