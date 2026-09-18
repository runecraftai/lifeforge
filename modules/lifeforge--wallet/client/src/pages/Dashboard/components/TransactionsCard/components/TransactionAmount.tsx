import { Text, usePersonalization } from '@lifeforge/ui'

import numberToCurrency from '../../../../../utils/numberToCurrency'
import type { WalletTransaction } from '../../../../Transactions'

function TransactionAmount({
  type,
  amount
}: {
  type: WalletTransaction['type']
  amount: number
}) {
  const { currency } = usePersonalization()

  return (
    <Text
      color={
        type === 'income'
          ? 'green-500'
          : type === 'expenses'
            ? 'red-500'
            : 'blue-500'
      }
    >
      {
        {
          income: '+',
          expenses: '-',
          transfer: ''
        }[type]
      }
      {numberToCurrency(amount, currency.locale)}
    </Text>
  )
}

export default TransactionAmount
