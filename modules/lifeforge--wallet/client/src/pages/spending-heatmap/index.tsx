import { useModuleTranslation } from '@lifeforge/localization'
import {
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  ModuleHeader,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import HeatmapControlsModal from './components/heatmap-controls-modal'
import SpendingHeatmapMap from './components/spending-heatmap-map'
import {
  SpendingHeatmapProvider,
  useSpendingHeatmap
} from './providers/spending-heatmap-provider'

function SpendingHeatmapView() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const {
    preferences,
    setPreferences,
    isZoomedIn,
    spendingData,
    spendingDataQuery,
    googleMapAPIKeyQuery
  } = useSpendingHeatmap()

  return (
    <>
      <ModuleHeader
        icon="uil:map-marker"
        title="Spending Heatmap"
        trailing={
          <ContextMenu align="end">
            <ContextMenuItem
              icon="tabler:adjustments"
              label={t('spendingHeatmap.controls.title')}
              onClick={() =>
                open(HeatmapControlsModal, {
                  preferences,
                  setPreferences,
                  isZoomedIn
                })
              }
            />
          </ContextMenu>
        }
      />
      <WithQuery query={googleMapAPIKeyQuery} showRetryButton={false}>
        {googleMapAPIKey =>
          googleMapAPIKey ? (
            <WithQuery query={spendingDataQuery}>
              {() =>
                spendingData.length > 0 ? (
                  <SpendingHeatmapMap googleMapAPIKey={googleMapAPIKey} />
                ) : (
                  <EmptyStateScreen
                    icon="tabler:map-pin-off"
                    message={{
                      id: 'location'
                    }}
                  />
                )
              }
            </WithQuery>
          ) : (
            <EmptyStateScreen
              icon="tabler:key-off"
              message={{
                id: 'mapKey'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

function SpendingHeatmap() {
  return (
    <SpendingHeatmapProvider>
      <SpendingHeatmapView />
    </SpendingHeatmapProvider>
  )
}

export default SpendingHeatmap
