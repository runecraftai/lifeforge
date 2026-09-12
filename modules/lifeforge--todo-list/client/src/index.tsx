import { Flex, ModuleHeader } from '@lifeforge/ui'

import { TodoListProvider } from '@/entities/task'

import { TodoListPage } from '@/pages/todo-list'

export function TodoList() {
  return (
    <Flex direction="column" flex="1" minHeight="0">
      <ModuleHeader />
      <TodoListProvider>
        <TodoListPage />
      </TodoListProvider>
    </Flex>
  )
}

export default TodoList
