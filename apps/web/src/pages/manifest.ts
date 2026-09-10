import { lazy } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'

export default {
  routes: {
    '/': lazy(() => import('./TodoList'))
  },
  name: 'todo',
  icon: 'tabler:checklist',
  category: 'Productivity',
  APIKeyAccess: {}
} satisfies ModuleGroup['items'][number]
