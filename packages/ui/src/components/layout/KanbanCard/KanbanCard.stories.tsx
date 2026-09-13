import type { Meta, StoryObj } from '@storybook/react-vite'

import { KanbanCard } from './index'

const meta = {
  component: KanbanCard,
  parameters: {
    docs: {
      description: {
        component:
          'A draggable kanban item with a title, source badge, optional metadata badges, and a stable item identifier. The default variant matches the unified kanban card.'
      }
    }
  },
  title: 'Layout/KanbanCard'
} satisfies Meta<typeof KanbanCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    itemId: 'task-42',
    kind: 'Task',
    priority: 'High',
    repo: 'lifeforge',
    source: 'Personal',
    title: 'Prepare the release notes'
  },
  globals: {
    bgTemp: 'bg-zinc',
    theme: 'light',
    themeColor: '#2196f3'
  }
}

export const Dragging: Story = {
  args: {
    itemId: 'mission-7',
    priority: 'In progress',
    source: 'Mission',
    title: 'Review the migration slice',
    variant: 'dragging'
  },
  globals: {
    bgTemp: 'bg-slate',
    theme: 'dark',
    themeColor: '#4caf50'
  }
}
