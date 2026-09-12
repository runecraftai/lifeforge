import { Flex, ModuleHeader } from '@lifeforge/ui'

import { TodoListProvider } from '@/entities/task'

import { TodoListPage } from '@/pages/todo-list/todo-list-page'

function TodoList() {
  return (
    <Flex direction="column" flex="1" minHeight="0">
      <ModuleHeader />
      <TodoListProvider>
        <TodoListPage />
      </TodoListProvider>
    </Flex>
  )
}

export { TodoList }

export default TodoList
