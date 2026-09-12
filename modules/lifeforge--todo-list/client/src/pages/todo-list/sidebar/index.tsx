import { SidebarDivider, SidebarTitle, SidebarWrapper } from '@lifeforge/ui'

import { TaskListList } from './components/task-list-list'
import { TaskPriorityList } from './components/task-priority-list'
import { TaskStatusList } from './components/task-status-list'
import { TaskTagList } from './components/task-tag-list'

export function Sidebar() {
  return (
    <SidebarWrapper>
      <SidebarTitle label="tasks" />
      <TaskStatusList />
      <SidebarDivider />
      <TaskPriorityList />
      <SidebarDivider />
      <TaskListList />
      <SidebarDivider />
      <TaskTagList />
    </SidebarWrapper>
  )
}
