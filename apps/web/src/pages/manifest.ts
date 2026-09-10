import { lazy } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'

export default {
  routes: {
    '/': lazy(() => import('./TodoList'))
  },
  name: 'todo',
  icon: 'tabler:checklist',
  category: 'PRODUCTIVITY',
  APIKeyAccess: {}
} satisfies ModuleGroup['items'][number]
