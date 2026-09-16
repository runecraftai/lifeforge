import { useCallback, useMemo } from 'react'

import { useForgeMutation } from '@lifeforge/api'
import { ConfirmationModal, SidebarItem, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/shared/api'

import type { CalendarCategory } from '../../../../../components/Calendar'
import ModifyCategoryModal from '../../../../../modals/modify-category-modal'
import ActionMenu from './action-menu'

function CategoryListItem({
  item,
  isSelected,
  onSelect,
  onCancelSelect,
  modifiable = true
}: {
  item: CalendarCategory
  isSelected: boolean
  onSelect: (item: CalendarCategory) => void
  onCancelSelect: () => void
  modifiable?: boolean
}) {
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(
    forgeAPI.categories.remove.input({ id: item.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.categories.list.key,
      onSuccess: () => onCancelSelect()
    }
  )

  const handleEdit = useCallback(() => {
    open(ModifyCategoryModal, {
      initialData: item,
      type: 'update'
    })
  }, [item])

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Category',
      description: `Are you sure you want to delete the category "${item.name}"?`,
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      },
      confirmationPrompt: item.name
    })
  }, [item])

  const contextMenuItems = useMemo(
    () =>
      modifiable ? (
        <ActionMenu onDelete={handleDelete} onEdit={handleEdit} />
      ) : undefined,
    []
  )

  const handleClick = useCallback(() => {
    onSelect(item)
  }, [])

  return (
    <SidebarItem
      active={isSelected}
      contextMenuItems={contextMenuItems}
      icon={item.icon}
      label={item.name}
      namespace={false}
      sideStripColor={item.color}
      onCancelButtonClick={onCancelSelect}
      onClick={handleClick}
    />
  )
}

export default CategoryListItem
