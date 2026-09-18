import {
  Box,
  EmptyStateScreen,
  Flex,
  ModuleHeader,
  Scrollbar
} from '@lifeforge/ui'

import Clock from '@/widgets/Clock'
import DateWidget from '@/widgets/Date'
import LocalIp from '@/widgets/LocalIp'
import Quotes from '@/widgets/Quotes'

const widgets = [
  { component: LocalIp, id: 'localIpWidget' },
  { component: DateWidget, id: 'date' },
  { component: Clock, id: 'clock' },
  { component: Quotes, id: 'quotes' }
]

export default function UtilityWidgets() {
  if (widgets.length === 0) {
    return (
      <EmptyStateScreen
        message={{
          id: 'utility-widgets-empty',
          tKey: 'utilityWidgets.empty'
        }}
      />
    )
  }

  return (
    <Flex direction="column" flex="1" minHeight="0">
      <ModuleHeader />
      <Scrollbar>
        <Box p="md">
          <Flex direction="column" gap="md">
            <Flex align="stretch" gap="md" wrap="wrap">
              {widgets.map(({ component: WidgetComponent, id }) => (
                <Box key={id} flex="1 1 20rem" minWidth="20rem">
                  <WidgetComponent dimension={{ h: 2, w: 2 }} />
                </Box>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Scrollbar>
    </Flex>
  )
}
