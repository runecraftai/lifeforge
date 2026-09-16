import { useQuery } from '@tanstack/react-query'

import { Box, Card, Flex, Icon, Stack, Text, surface } from '@lifeforge/ui'

import type { WalletAsset } from '../../../shared/lib/hooks/use-wallet-data'
import { forgeAPI } from '@/shared/api'
import { useWalletStore } from '../../../entities/wallet/model/use-wallet-store'

import AssetAmount from './asset-amount'
import AssetBalanceChart from './asset-balance-chart'
import AssetContextMenu from './asset-context-menu'
import AssetDelta from './asset-delta'

function AssetItem({
  asset,
  rangeMode
}: {
  asset: WalletAsset
  rangeMode: 'week' | 'month' | 'quarter' | 'year' | 'all'
}) {
  const { isAmountHidden } = useWalletStore()

  const balanceQuery = useQuery(
    forgeAPI.assets.getAssetAccumulatedBalance
      .input({
        id: asset.id,
        rangeMode
      })
      .queryOptions()
  )

  const delta = balanceQuery.data
    ? balanceQuery.data.endBalance - balanceQuery.data.startBalance
    : 0

  const deltaPercent =
    balanceQuery.data && balanceQuery.data.startBalance > 0
      ? (delta / balanceQuery.data.startBalance) * 100
      : 0

  return (
    <Card
      direction={{ base: 'column', md: 'row' }}
      gapX="2xl"
      gapY="lg"
      justify="between"
    >
      <Flex align="center" gap="md">
        <Box bg={surface.light} color="muted" p="sm" r="md">
          <Icon icon={asset.icon} />
        </Box>
        <Text as="h2" size="xl" weight="medium">
          {asset.name}
        </Text>
      </Flex>
      <Flex align="center" gap="lg" justify="between">
        <Stack align={{ base: 'start', md: 'end' }} gap="none">
          <AssetAmount amount={asset.current_balance} />
          {balanceQuery.data && !isAmountHidden && (
            <AssetDelta delta={delta} deltaPercent={deltaPercent} />
          )}
        </Stack>
        <AssetBalanceChart asset={asset} rangeMode={rangeMode} />
        <AssetContextMenu asset={asset} />
      </Flex>
    </Card>
  )
}

export default AssetItem
