import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'

import { Box, Flex, Text } from '@/components/primitives'

import * as styles from './SidebarItemContent.css'

export function SidebarItemContent({
  label,
  sidebarExpanded,
  isMainSidebarItem,
  number,
  hasContextMenu,
  hasCancelButton,
  namespace,
  hasSubsection
}: {
  label: string | React.ReactElement
  sidebarExpanded: boolean
  isMainSidebarItem: boolean
  number?: number
  hasContextMenu?: boolean
  hasCancelButton?: boolean
  namespace?: string | false
  hasSubsection: boolean
}) {
  const { t } = useModuleTranslation(
    namespace === false
      ? []
      : namespace
        ? [namespace, 'common.sidebar']
        : ['common.sidebar']
  )

  return (
    <>
      <Flex align="center" gap="md" justify="between" minWidth="0" width="100%">
        {(() => {
          if (!isMainSidebarItem) {
            return (
              <Box
                asChild
                minWidth="0"
                pr={number !== undefined && !hasSubsection ? '2xl' : 'none'}
                width="100%"
              >
                <Text truncate as="div">
                  {typeof label === 'string' && namespace !== false
                    ? t([
                        `${namespace}:sidebar.${_.camelCase(label)}`,
                        `sidebar.${_.camelCase(label)}`,
                        label
                      ])
                    : label}{' '}
                  {number !== undefined && hasSubsection && (
                    <Text
                      as="span"
                      color={{
                        base: 'bg-400',
                        dark: 'bg-600'
                      }}
                      size="sm"
                    >
                      ({number})
                    </Text>
                  )}
                </Text>
              </Box>
            )
          }

          return (
            sidebarExpanded && (
              <Flex
                align="center"
                justify="between"
                minWidth="0"
                overflow="hidden"
                style={{ gap: '0.75rem' }}
                width="100%"
              >
                <Box asChild minWidth="0" width="100%">
                  <Text truncate>
                    {typeof label === 'string'
                      ? t(`common.sidebar:apps.${label}.title`)
                      : label}
                  </Text>
                </Box>
              </Flex>
            )
          )
        })()}
        {number !== undefined && !hasSubsection && (
          <Box
            asChild
            position="absolute"
            right="1em"
            style={{
              transform: 'translateY(-50%)'
            }}
            top="50%"
          >
            <Text
              as="span"
              className={
                !hasCancelButton && hasContextMenu
                  ? styles.numberBadgeGroupHoverHide
                  : undefined
              }
              pr="sm"
              size="sm"
              style={{
                display: hasCancelButton ? 'none' : undefined
              }}
            >
              {number.toLocaleString()}
            </Text>
          </Box>
        )}
      </Flex>
    </>
  )
}
