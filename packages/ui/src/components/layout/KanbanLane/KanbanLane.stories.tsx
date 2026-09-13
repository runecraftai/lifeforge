import type { Meta, StoryObj } from '@storybook/react-vite'

import { KanbanColumn } from '../KanbanColumn'
import { KanbanLane } from './index'

const meta = {
  component: KanbanLane,
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal kanban lane with a labelled divider and scrollable columns. Use one lane for each board grouping, such as personal work or missions.'
      }
    }
  },
  title: 'Layout/KanbanLane'
} satisfies Meta<typeof KanbanLane>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Personal work'
  },
  globals: {
    bgTemp: 'bg-zinc',
    theme: 'light',
    themeColor: '#2196f3'
  },
  render: args => (
    <KanbanLane {...args}>
      <KanbanColumn count={1} title="To do">
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-lf-bg-700 dark:bg-lf-bg-900">
          Prepare the next step
        </div>
      </KanbanColumn>
      <KanbanColumn isEmpty count={0} title="Done" />
    </KanbanLane>
  )
}

export const CompactDark: Story = {
  args: {
    title: 'Squad missions',
    variant: 'compact'
  },
  globals: {
    bgTemp: 'bg-slate',
    theme: 'dark',
    themeColor: '#4caf50'
  },
  render: args => (
    <KanbanLane {...args}>
      <KanbanColumn count={2} title="Doing">
        <div className="rounded-lg border border-lf-bg-700 bg-lf-bg-900 p-3 text-sm text-lf-bg-50">
          Coordinate the handoff
        </div>
      </KanbanColumn>
    </KanbanLane>
  )
}
