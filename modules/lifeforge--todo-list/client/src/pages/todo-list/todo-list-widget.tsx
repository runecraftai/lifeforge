import { Link, useNavigate } from 'react-router'

import type { WidgetConfig } from '@lifeforge/configs'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  Flex,
  Scrollbar,
  Widget,
  WithQuery
} from '@lifeforge/ui'

import { TaskItem } from '@/features/complete-task/task-item'
import {
  TodoListProvider,
  useTodoListContext
} from '@/entities/task'

function TodoListContent() {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const { entriesQuery } = useTodoListContext()

  return (
    <WithQuery query={entriesQuery}>
      {entries => (
        <Flex as="ul" direction="column" flex="1" gap="sm" pr="md">
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
        </Flex>
      )}
    </WithQuery>
  )
}

function TodoList() {
  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          icon="tabler:chevron-right"
          mr="md"
          p="sm"
          to="/todo-list"
          variant="plain"
        />
      }
      icon="tabler:clipboard-list"
      pr="md"
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

export default TodoList
