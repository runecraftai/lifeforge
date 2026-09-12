import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  SidebarTitle,
  Text,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { ModifyTagModal } from '@/features/manage-tags/modify-tag-modal'
import { useTodoListContext } from '@/entities/task'

import { TaskTagListItem } from './task-tag-list-item'

function TaskTagList() {
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

export { TaskTagList }
