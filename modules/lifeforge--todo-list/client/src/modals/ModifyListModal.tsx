import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { InferInput } from '@lifeforge/api'
import { FormModal, defineForm, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { TodoListList } from '../providers/TodoListProvider'

function ModifyListModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TodoListList
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.lists.create
      : forgeAPI.lists.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['todoList', 'lists']
        })
      },
      onError: error => {
        toast.error(`Failed to ${type} list: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.lists)[typeof type]>['body']
  >({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    namespace: 'apps.todoList',
    title: `list.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      name: 'text',
      icon: 'icon',
      color: 'color'
    })
    .setupFields({
      name: {
        required: true,
        label: 'List name',
        icon: 'tabler:list',
        placeholder: 'List name',
        type: 'text'
      },
      icon: {
        required: true,
        label: 'List icon',
        type: 'icon'
      },
      color: {
        required: true,
        label: 'List color',
        type: 'color'
      }
    })
    .initialData(
      initialData ?? {
        name: '',
        icon: '',
        color: '#FFFFFF'
      }
    )
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyListModal
