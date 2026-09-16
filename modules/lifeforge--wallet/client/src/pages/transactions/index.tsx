import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import {
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  LayoutWithSidebar,
  ModuleHeader,
  Stack,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/shared/api'

import HeaderMenu from './components/header-menu'
import InnerHeader from './components/inner-header'
import SearchBar from './components/search-bar'
import Sidebar from './components/sidebar'
import TransactionCreationMenu from './components/transaction-creation-menu'
import TransactionList from './components/transaction-list'

export type WalletTransaction = InferOutput<
  typeof forgeAPI.transactions.list
>[number]

export type WalletCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

function Transactions() {
  const transactionsQuery = useQuery(forgeAPI.transactions.list.queryOptions())

  return (
    <>
      <ModuleHeader
        icon="tabler:arrows-exchange"
        title="transactions"
        trailing={
          <>
            <TransactionCreationMenu variant="desktop" />
            <HeaderMenu />
          </>
        }
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader />
          <SearchBar />
          <Stack gap="md" height="100%" my="lg" width="100%">
            <WithQuery query={transactionsQuery}>
              {transactions =>
                transactions.length > 0 ? (
                  <TransactionList />
                ) : (
                  <EmptyStateScreen
                    icon="tabler:wallet-off"
                    message={{
                      id: 'transactions'
                    }}
                  />
                )
              }
            </WithQuery>
            <TransactionCreationMenu variant="mobile" />
          </Stack>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </>
  )
}

export default Transactions
