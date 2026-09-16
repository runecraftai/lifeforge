import { createContext, useContext } from 'react'

import type { WalletTransaction } from '../../../..'

const TransactionDetailsContext = createContext<WalletTransaction | null>(null)

export function TransactionDetailsProvider({
  transaction,
  children
}: {
  transaction: WalletTransaction
  children: React.ReactNode
}) {
  return (
    <TransactionDetailsContext value={transaction}>
      {children}
    </TransactionDetailsContext>
  )
}

export function useTransactionDetails() {
  const ctx = useContext(TransactionDetailsContext)

  if (!ctx) {
    throw new Error(
      'useTransactionDetails must be used within TransactionDetailsProvider'
    )
  }

  return ctx
}
