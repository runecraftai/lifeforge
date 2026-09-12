import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, WithQuery, useModalStore } from '@lifeforge/ui'

import { ModifyPriorityModal } from '@/features/manage-priorities/modify-priority-modal'
import { useTodoListContext } from '@/entities/task'

import { TaskPriorityListItem } from './task-priority-list-item'

function TaskPriorityList() {
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
            <p className="text-bg-500 text-center">{t('empty.priorities')}</p>
          )
        }
      </WithQuery>
    </>
  )
}

export { TaskPriorityList }
