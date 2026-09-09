import { useModuleTranslation } from '@lifeforge/localization'
import { Button, TagsFilter, useModuleSidebarState } from '@lifeforge/ui'

import { useTodoListContext } from '@/providers/TodoListProvider'

function Header() {
  const { t } = useModuleTranslation()
  const { setIsSidebarOpen } = useModuleSidebarState()

  const {
    entriesQuery,
    prioritiesQuery,
    listsQuery,
    tagsListQuery,
    setSelectedTask,
    setModifyTaskWindowOpenType,
    filter,
    setFilter
  } = useTodoListContext()

  const entries = entriesQuery.data ?? []

  const priorities = prioritiesQuery.data ?? []

  const lists = listsQuery.data ?? []

  const tags = tagsListQuery.data ?? []

  return (
    <div className="flex-between flex px-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold md:text-4xl">
          {`${t(
            `headers.${(() => {
              const status = filter.status

              const hasFilter =
                filter.list !== null ||
                filter.tag !== null ||
                filter.priority !== null

              if (status === null || status === '') {
                return hasFilter ? 'filtered' : 'all'
              }

              return status === 'today' ? 'todays' : status
            })().toLowerCase()}Tasks`
          )}`.trim()}{' '}
          <span className="text-bg-500 text-base">({entries.length})</span>
        </h1>
        <TagsFilter
          availableFilters={{
            list: {
              data: lists.map(e => ({
                id: e.id,
                label: e.name,
                icon: 'tabler:list',
                color: e.color
              }))
            },
            tag: {
              data: tags.map(e => ({
                label: e.name,
                id: e.id,
                icon: 'tabler:tag'
              }))
            },
            priority: {
              data: priorities.map(e => ({
                id: e.id,
                label: e.name,
                color: e.color,
                icon: 'tabler:adjustments'
              })),
              isColored: true
            }
          }}
          values={{
            tag: filter.tag,
            list: filter.list,
            priority: filter.priority
          }}
          onChange={{
            tag: setFilter.bind(null, 'tag'),
            list: setFilter.bind(null, 'list'),
            priority: setFilter.bind(null, 'priority')
          }}
        />
      </div>
      <div className="flex items-center gap-6">
        <Button
          className="hidden sm:flex"
          icon="tabler:plus"
          tProps={{ item: t('items.task') }}
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        >
          new
        </Button>
        <Button
          className="xl:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </div>
    </div>
  )
}

export default Header
