import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { useNavigate } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  FAB,
  Grid,
  ModuleHeader
} from '@lifeforge/ui'

import { useWalletStore } from '../../entities/wallet/model/use-wallet-store'

import AssetsBalanceCard from './components/assets-balance-card'
import CategoriesBreakdownCard from './components/categories-breakdown-card'
import IncomeExpenseCard from './components/income-expenses-card'
import StatisticChardCard from './components/statistic-chart-card'
import TransactionsCard from './components/transactions-card'
import TransactionsCountCard from './components/transactions-count-card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LogarithmicScale
)

function WalletDashboard() {
  const navigate = useNavigate()
  const { t } = useModuleTranslation(['common.buttons'])
  const { isAmountHidden, toggleAmountVisibility } = useWalletStore()

  return (
    <>
      <ModuleHeader
        trailing={
          <>
            <ContextMenu
              buttonComponent={
                <Button
                  icon="tabler:plus"
                  tProps={{
                    item: t('items.transaction')
                  }}
                  onClick={() => {}}
                >
                  new
                </Button>
              }
              display={{ base: 'none', md: 'block' }}
            >
              <ContextMenuItem
                icon="tabler:plus"
                label="Add Manually"
                onClick={() => {
                  navigate('/wallet/transactions#new')
                }}
              />
              <ContextMenuItem
                icon="tabler:scan"
                label="Scan Receipt"
                onClick={() => {
                  navigate('/wallet/transactions#scan')
                }}
              />
            </ContextMenu>
            <ContextMenu>
              <ContextMenuItem
                checked={isAmountHidden}
                icon="tabler:eye-off"
                label="Hide Amount"
                onClick={() => {
                  toggleAmountVisibility()
                }}
              />
            </ContextMenu>
          </>
        }
      />
      <Grid gap="sm" pb="2xl" templateCols={{ base: 1, xl: 3 }} width="100%">
        <IncomeExpenseCard icon="tabler:login-2" title="Income" />
        <IncomeExpenseCard icon="tabler:logout-2" title="Expenses" />
        <AssetsBalanceCard />
        <StatisticChardCard />
        <TransactionsCountCard />
        <TransactionsCard />
        <CategoriesBreakdownCard />
      </Grid>
      <ContextMenu
        bottom="1.5rem"
        buttonComponent={<FAB visibilityBreakpoint="md" />}
        position="fixed"
        right="1.5rem"
      >
        <ContextMenuItem
          icon="tabler:plus"
          label="Add Manually"
          onClick={() => {
            navigate('/wallet/transactions#new')
          }}
        />
        <ContextMenuItem
          icon="tabler:scan"
          label="Scan Receipt"
          onClick={() => {
            navigate('/wallet/transactions#scan')
          }}
        />
      </ContextMenu>
    </>
  )
}

export default WalletDashboard
