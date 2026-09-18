import { useQuery } from '@tanstack/react-query'

import {
  Flex,
  Text,
  WithQuery,
  colorWithOpacity,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import numberToCurrency from '@/utils/numberToCurrency'

function OverviewSummary({ month, year }: { month: number; year: number }) {
  const { currency } = usePersonalization()

  const incomeExpensesQuery = useQuery(
    forgeAPI.analytics.getIncomeExpensesSummary
      .input({ year: year.toString(), month: (month + 1).toString() })
      .queryOptions()
  )

  return (
    <WithQuery query={incomeExpensesQuery}>
      {({ monthlyIncome, monthlyExpenses }) => {
        const netIncome = monthlyIncome - monthlyExpenses

        return (
          <Flex direction="column" mt="lg" width="100%">
            <Flex align="center" justify="between" p="md">
              <Text size="xl">Income</Text>
              <Text size="lg">
                {currency.symbol}{' '}
                {numberToCurrency(monthlyIncome, currency.locale)}
              </Text>
            </Flex>
            <Flex
              align="center"
              bg={colorWithOpacity('bg-500', '5%')}
              justify="between"
              p="md"
            >
              <Text size="xl">Expenses</Text>
              <Text size="lg">
                {currency.symbol} (
                {numberToCurrency(monthlyExpenses, currency.locale)})
              </Text>
            </Flex>
            <Flex align="center" justify="between">
              <Text p="md" size="xl" weight="semibold">
                Net Income / (Loss)
              </Text>
              <Text
                color={netIncome < 0 ? 'rose-600' : undefined}
                p="md"
                size="lg"
                style={{ borderTop: '2px solid', borderBottom: '6px double' }}
                weight="medium"
              >
                {currency.symbol}{' '}
                {netIncome >= 0
                  ? numberToCurrency(netIncome, currency.locale)
                  : `(${numberToCurrency(Math.abs(netIncome), currency.locale)})`}
              </Text>
            </Flex>
          </Flex>
        )
      }}
    </WithQuery>
  )
}

export default OverviewSummary
