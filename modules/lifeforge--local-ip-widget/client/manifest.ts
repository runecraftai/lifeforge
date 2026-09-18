import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@'))
  },
  hidden: true,
  contract,
  widgets: [
    () => import('@/widgets/LocalIp'),
    () => import('@/widgets/Date'),
    () => import('@/widgets/Clock'),
    () => import('@/widgets/Quotes')
  ]
})

export default manifest

export { forgeAPI }
