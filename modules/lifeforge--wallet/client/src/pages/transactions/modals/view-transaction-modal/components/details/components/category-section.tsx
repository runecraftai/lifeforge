import { Flex, Icon, Text } from '@lifeforge/ui'

import { useWalletData } from '../../../../../../../shared/lib/hooks/use-wallet-data'

import { useTransactionDetails } from '../transaction-details-context'
import DetailItem from './detail-item'

function CategorySection() {
  const transaction = useTransactionDetails()
  const { categoriesQuery } = useWalletData()

  if (transaction.type === 'transfer') return null

  const category = categoriesQuery.data?.find(
    c => c.id === transaction.category
  )

  if (!category) return null

  return (
    <DetailItem icon="tabler:category" label="category">
      <Flex align="center" gap="xs">
        <Icon
          icon={category.icon}
          size="1.5rem"
          style={{ color: category.color }}
        />
        <Text>{category.name}</Text>
      </Flex>
    </DetailItem>
  )
}

export default CategorySection
