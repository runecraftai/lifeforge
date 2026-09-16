import { SidebarDivider, SidebarWrapper } from '@lifeforge/ui'

import useFilter from '../../../../shared/lib/hooks/use-filter'

import AllTransactionsButton from './components/all-transactions-button'
import AssetsSection from './components/assets-section'
import CategoriesSection from './components/categories-section'
import DateRangeSelector from './components/date-range-selector'
import LedgerSection from './components/ledger-section'
import MiniCalendar from './components/mini-calendar'
import TypeSection from './components/type-section'

function Sidebar() {
  const { type } = useFilter()

  return (
    <SidebarWrapper>
      <AllTransactionsButton />
      <SidebarDivider />
      <MiniCalendar />
      <SidebarDivider />
      <DateRangeSelector />
      <SidebarDivider />
      <TypeSection />
      <SidebarDivider />
      <CategoriesSection />
      {type !== 'transfer' && <SidebarDivider />}
      <AssetsSection />
      <SidebarDivider />
      <LedgerSection />
    </SidebarWrapper>
  )
}

export default Sidebar
