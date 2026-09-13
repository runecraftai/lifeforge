import type { Meta, StoryObj } from '@storybook/react-vite'

import { KanbanCard } from '../KanbanCard'
import { KanbanColumn } from './index'

const meta = {
  component: KanbanColumn,
  parameters: {
    docs: {
      description: {
        component:
          'A kanban status column that owns its heading, item count, empty state, and drop-target presentation. Place draggable cards in its children.'
      }
    }
  },
  title: 'Layout/KanbanColumn'
} satisfies Meta<typeof KanbanColumn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    count: 2,
    title: 'To do'
  },
  globals: {
    bgTemp: 'bg-zinc',
    theme: 'light',
    themeColor: '#2196f3'
  },
  render: args => (
    <div className="w-80">
      <KanbanColumn {...args}>
        <KanbanCard source="Personal" title="Write the outline" />
        <KanbanCard source="Mission" title="Check the acceptance criteria" />
      </KanbanColumn>
    </div>
  )
}

export const EmptyDropTarget: Story = {
  args: {
    count: 0,
    emptyLabel: 'Drop an item here',
    isEmpty: true,
    title: 'Done',
    variant: 'drop-target'
  },
  globals: {
    bgTemp: 'bg-slate',
    theme: 'dark',
    themeColor: '#4caf50'
  },
  render: args => (
    <div className="w-80">
      <KanbanColumn {...args} />
    </div>
  )
}
