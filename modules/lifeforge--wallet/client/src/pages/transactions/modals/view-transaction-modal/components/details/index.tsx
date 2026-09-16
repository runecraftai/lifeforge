import { Stack } from '@lifeforge/ui'

import type { WalletTransaction } from '../../../..'

import { TransactionDetailsProvider } from './transaction-details-context'
import AssetSection from './components/asset-section'
import CategorySection from './components/category-section'
import DateSection from './components/date-section'
import LedgerSection from './components/ledger-section'
import LocationSection from './components/location-section'
import ReceiptSection from './components/receipt-section'
import TransactionTypeSection from './components/transaction-type-section'

function Details({ transaction }: { transaction: WalletTransaction }) {
  return (
    <TransactionDetailsProvider transaction={transaction}>
      <Stack gap="md" mt="lg">
        <TransactionTypeSection />
        <DateSection />
        <CategorySection />
        <AssetSection />
        <LedgerSection />
        <ReceiptSection />
        <LocationSection />
      </Stack>
    </TransactionDetailsProvider>
  )
}

export default Details
