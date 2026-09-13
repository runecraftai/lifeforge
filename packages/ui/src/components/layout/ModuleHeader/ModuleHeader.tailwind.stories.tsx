import type { Meta, StoryObj } from '@storybook/react-vite'

import { MainSidebarStateProvider } from '../../../providers'
import { ModuleWrapper } from '../ModuleWrapper'
import { ModuleHeaderTailwind } from './ModuleHeader.tailwind'

const meta = {
  component: ModuleHeaderTailwind,
  parameters: {
    docs: {
      description: {
        component:
          'The Tailwind-native module header. It reads title and icon metadata from ModuleWrapper by default, supports explicit overrides and trailing actions, follows the shared light/dark tokens, and shows the navigation button below the sm breakpoint when the sidebar is collapsed.'
      }
    }
  },
  title: 'Layout/ModuleHeader/Tailwind'
} satisfies Meta<typeof ModuleHeaderTailwind>

export default meta

type Story = StoryObj<typeof meta>

function StoryShell({ children }: { children: React.ReactNode }) {
  return (
    <MainSidebarStateProvider>
      <ModuleWrapper
        config={{
          clearQueryOnUnmount: false,
          icon: 'tabler:layout-dashboard',
          name: '',
          title: 'Demo Module'
        }}
      >
        {children}
      </ModuleWrapper>
    </MainSidebarStateProvider>
  )
}

export const Default: Story = {
  args: {},
  globals: {
    bgTemp: 'bg-zinc',
    theme: 'light',
    themeColor: '#2196f3'
  },
  render: args => (
    <StoryShell>
      <ModuleHeaderTailwind {...args} />
    </StoryShell>
  )
}

export const DarkWithTrailingAction: Story = {
  args: {
    icon: 'tabler:rocket',
    title: 'Launch plan',
    trailing: (
      <button
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        type="button"
      >
        Create
      </button>
    )
  },
  globals: {
    bgTemp: 'bg-slate',
    theme: 'dark',
    themeColor: '#4caf50'
  },
  render: args => (
    <StoryShell>
      <ModuleHeaderTailwind {...args} />
    </StoryShell>
  )
}
