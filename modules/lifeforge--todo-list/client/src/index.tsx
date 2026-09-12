import { ModuleHeader } from '@lifeforge/ui'

import { TodoListProvider } from '@/entities/task'

import { TodoListPage } from '@/pages/todo-list/todo-list-page'

function TodoList() {
  return (
    <>
      <ModuleHeader />
      <TodoListProvider>
        <TodoListPage />
      </TodoListProvider>
    </>
  )
}

export { TodoList }

export default TodoList
