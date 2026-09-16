import { SidebarTitle } from '@lifeforge/ui'

import { useWalletData } from '../../../../../shared/lib/hooks/use-wallet-data'

import TypeSectionItem from './type-section-item'

const TYPES = [
  ['tabler:arrow-bar-both', 'All Types'],
  ['tabler:login-2', 'Income'],
  ['tabler:logout', 'Expenses'],
  ['tabler:transfer', 'Transfer']
]

function TypeSection() {
  const { typesCountQuery } = useWalletData()

  return (
    <>
      <SidebarTitle label="transactionTypes" />
      {TYPES.map(([icon, name]) => (
        <TypeSectionItem
          key={name}
          amount={typesCountQuery.data?.[name.toLowerCase()]?.transactionCount}
          icon={icon}
          label={name}
        />
      ))}
    </>
  )
}

export default TypeSection
