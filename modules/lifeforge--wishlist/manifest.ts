import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Wishlist',
  icon: 'tabler:heart',
  routes: {
    '/': lazy(() => import('@/pages/WishlistList')),
    '/:id': lazy(() => import('@/pages/WishlistEntries'))
  },
  hasAI: true,
  category: 'Finance'
} satisfies ModuleConfig
