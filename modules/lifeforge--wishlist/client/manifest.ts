import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'
import styles from './index.css?inline'

const STYLE_ID = 'lifeforge--wishlist-styles'

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')

  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)
}

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@/pages/WishlistList')),
    '/:id': lazy(() => import('@/pages/WishlistEntries'))
  },
  contract
})

export default manifest

export { forgeAPI }
