import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

export const { forgeAPI, ...manifest } = createForgeModule({
  provider: lazy(() => import('@/pages/music/providers/music-provider')),
  routes: {
    '/': lazy(() => import('@'))
  },
  widgets: [() => import('@/pages/music/widgets/music-player')],
  contract
})

export default manifest
