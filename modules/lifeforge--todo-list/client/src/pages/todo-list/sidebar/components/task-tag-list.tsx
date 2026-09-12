import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, Text, WithQuery, useModalStore } from '@lifeforge/ui'

import { useTodoListContext } from '@/entities/task'
import { ModifyTagModal } from '@/features/manage-tags'

import { TaskTagListItem } from './task-tag-list-item'

export function TaskTagList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { tagsListQuery } = useTodoListContext()

  const handleCreateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleCreateTag
        }}
        label="Tags"
      />
      <WithQuery query={tagsListQuery}>
        {tags =>
          tags.length > 0 ? (
            <>
              {tags.map(item => (
                <TaskTagListItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <Text color="muted" pl="3xl" py="sm" size="sm">
              {t('empty.tags')}
            </Text>
          )
        }
      </WithQuery>
    </>
  )
}
