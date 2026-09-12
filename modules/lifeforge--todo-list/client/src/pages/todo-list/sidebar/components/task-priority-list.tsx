import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, Text, WithQuery, useModalStore } from '@lifeforge/ui'

import { useTodoListContext } from '@/entities/task'
import { ModifyPriorityModal } from '@/features/manage-priorities'

import { TaskPriorityListItem } from './task-priority-list-item'

export function TaskPriorityList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { prioritiesQuery } = useTodoListContext()

  const handleCreatePriority = useCallback(() => {
    open(ModifyPriorityModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleCreatePriority
        }}
        label="priorities"
      />
      <WithQuery query={prioritiesQuery}>
        {priorities =>
          priorities.length > 0 ? (
            <>
              {priorities.map(item => (
                <TaskPriorityListItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <Text color="muted" pl="3xl" py="sm" size="sm">
              {t('empty.priorities')}
            </Text>
          )
        }
      </WithQuery>
    </>
  )
}
