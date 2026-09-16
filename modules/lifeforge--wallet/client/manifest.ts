import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  subsection: [
    { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
    {
      label: 'Transactions',
      icon: 'tabler:arrows-exchange',
      path: 'transactions'
    },
    { label: 'Assets', icon: 'tabler:wallet', path: 'assets' },
    { label: 'Ledgers', icon: 'tabler:book', path: 'ledgers' },
    {
      label: 'Spending Heatmap',
      icon: 'tabler:map-pin',
      path: 'spending-heatmap'
    },
    {
      label: 'Financial Statements',
      icon: 'tabler:file-text',
      path: 'statements'
    }
  ],
  routes: {
    '/': lazy(() => import('@/pages/dashboard')),
    '/transactions': lazy(() => import('@/pages/transactions')),
    '/assets': lazy(() => import('@/pages/assets')),
    '/ledgers': lazy(() => import('@/pages/ledgers')),
    '/spending-heatmap': lazy(() => import('@/pages/spending-heatmap')),
    '/statements': lazy(() => import('@/pages/statements'))
  },
  widgets: [() => import('@/features/assets-balance/assets-balance')],
  contract
})

export default manifest

export { forgeAPI }
