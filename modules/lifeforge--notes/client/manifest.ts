import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'
import styles from './src/index.css?inline'

const STYLE_ID = 'lifeforge--notes-styles'

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')

  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)
}

const { forgeAPI, ...manifest } = createForgeModule({
  routes: { '/': lazy(() => import('@')) },
  contract
})

export default manifest

export { forgeAPI }
