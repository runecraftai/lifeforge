import { Link, useNavigate } from 'react-router'

import type { WidgetConfig } from '@lifeforge/configs'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  Scrollbar,
  Widget,
  WithQuery
} from '@lifeforge/ui'

import TaskItem from '@/components/tasks/TaskItem'
import {
  TodoListProvider,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TodoListContent() {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const { entriesQuery } = useTodoListContext()

  return (
    <WithQuery query={entriesQuery}>
      {entries => (
        <ul className="flex flex-1 flex-col gap-2 pr-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <TaskItem
                key={entry.id}
                isInDashboardWidget
                className="component-bg-lighter-with-hover"
                entry={entry}
              />
            ))
          ) : (
            <EmptyStateScreen
              smaller
              CTAButtonProps={{
                icon: 'tabler:plus',
                tProps: { item: t('items.task') },
                children: 'new',
                onClick: () => {
                  navigate('/todo-list#new')
                }
              }}
              icon="tabler:calendar-smile"
              message={{
                id: 'today',
                tKey: 'widgets.todoList'
              }}
            />
          )}
        </ul>
      )}
    </WithQuery>
  )
}

export default function TodoList() {
  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          className="mr-3 p-2!"
          icon="tabler:chevron-right"
          to="/todo-list"
          variant="plain"
        />
      }
      className="pr-3"
      icon="tabler:clipboard-list"
      title="Todo List"
    >
      <TodoListProvider>
        <Scrollbar>
          <TodoListContent />
        </Scrollbar>
      </TodoListProvider>
    </Widget>
  )
}

export const config: WidgetConfig = {
  id: 'todoList',
  icon: 'tabler:checklist'
}
