import { SidebarItem, WithQuery } from '@lifeforge/ui'

import { useTodoListContext } from '@/entities/task'

export function TaskStatusList() {
  const { statusCounterQuery, filter, setFilter } = useTodoListContext()

  return (
    <WithQuery query={statusCounterQuery}>
      {statusCounter => (
        <>
          {[
            ['tabler:article', 'All'],
            ['tabler:calendar-exclamation', 'Today'],
            ['tabler:calendar-up', 'Scheduled'],
            ['tabler:calendar-x', 'Overdue'],
            ['tabler:calendar-check', 'Completed']
          ].map(([icon, name]) => {
            const status = name.toLowerCase()
            const isActive =
              filter.status === status || (name === 'All' && !filter.status)
            const selectedStatus = name === 'All' ? null : status

            return (
              <SidebarItem
                key={name}
                active={isActive}
                icon={icon}
                label={name}
                number={statusCounter[status as keyof typeof statusCounter]}
                onClick={() => {
                  setFilter('status', selectedStatus)
                }}
              />
            )
          })}
        </>
      )}
    </WithQuery>
  )
}
