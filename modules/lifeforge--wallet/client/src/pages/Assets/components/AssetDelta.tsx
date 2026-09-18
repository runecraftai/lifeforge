import { Text, usePersonalization } from '@lifeforge/ui'

import numberToCurrency from '@/utils/numberToCurrency'

function AssetDelta({
  delta,
  deltaPercent
}: {
  delta: number
  deltaPercent: number
}) {
  const { currency } = usePersonalization()

  return (
    <Text
      color={delta > 0 ? 'green-500' : delta < 0 ? 'red-500' : 'muted'}
      size="sm"
      weight="medium"
    >
      {delta >= 0 ? '+' : ''}
      {currency.symbol} {numberToCurrency(delta, currency.locale)} (
      {deltaPercent >= 0 ? '+' : ''}
      {deltaPercent.toFixed(1)}%)
    </Text>
  )
}

export default AssetDelta
