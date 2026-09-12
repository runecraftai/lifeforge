import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  SidebarTitle,
  Text,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { ModifyListModal } from '@/features/manage-lists/modify-list-modal'
import { useTodoListContext } from '@/entities/task'

import { TaskListListItem } from './task-list-list-item'

function TaskListList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { listsQuery } = useTodoListContext()

  const handleCreateList = useCallback(() => {
    open(ModifyListModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleCreateList
        }}
        label="lists"
      />
      <WithQuery query={listsQuery}>
        {lists =>
          lists.length > 0 ? (
            <>
              {lists.map(item => (
                <TaskListListItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <Text color="muted" pl="3xl" py="sm" size="sm">
              {t('empty.lists')}
            </Text>
          )
        }
      </WithQuery>
    </>
  )
}

export { TaskListList }
